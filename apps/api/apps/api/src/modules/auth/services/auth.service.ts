import { EmailSignupDto } from '@api/modules/auth/dto';
import { AppConfigService, PrismaService, LoggerService } from '@app/common';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  sessionId: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: AppConfigService,
    private readonly eventEmitter: EventEmitter2,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(AuthService.name);
  }

  async signup(dto: EmailSignupDto): Promise<Partial<User>> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        role: 'USER',
        emailVerified: false,
        provider: 'local',
      },
    });

    // Remove password from response
    const { password, ...result } = user;

    this.logger.log(`User signed up: ${user.email}`);

    return result;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    if (user.password && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(
    user: any,
    deviceInfo: { ip?: string; userAgent?: string },
  ) {
    const sessionId = uuidv4();
    const refreshToken = uuidv4();
    const expiresAt = new Date(
      Date.now() + this.config.jwtRefreshExpirationMs,
    );

    await this.prisma.session.create({
      data: {
        id: sessionId,
        refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    this.logger.log(`User logged in: ${user.email}`);

    return this.generateTokens(user, sessionId, refreshToken);
  }

  async refresh(
    oldRefreshToken: string,
    deviceInfo: { ip?: string; userAgent?: string },
  ) {
    const session = await this.prisma.session.findUnique({
      where: { refreshToken: oldRefreshToken },
      include: { user: true },
    });

    if (!session || session.isRevoked || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Rotate tokens
    const newSessionId = uuidv4();
    const newRefreshToken = uuidv4();
    const expiresAt = new Date(
      Date.now() + this.config.jwtRefreshExpirationMs,
    );

    await this.prisma.$transaction([
      this.prisma.session.update({
        where: { id: session.id },
        data: { isRevoked: true },
      }),
      this.prisma.session.create({
        data: {
          id: newSessionId,
          refreshToken: newRefreshToken,
          userId: session.userId,
          expiresAt,
        },
      }),
    ]);

    return this.generateTokens(session.user, newSessionId, newRefreshToken);
  }

  async logout(refreshToken: string) {
    await this.prisma.session.updateMany({
      where: { refreshToken },
      data: { isRevoked: true },
    });
  }

  private async generateTokens(
    user: any,
    sessionId: string,
    refreshToken: string,
  ) {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionId: sessionId,
    };

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.config.jwtSecret,
        expiresIn: this.config.jwtExpiration,
      }),
      refreshToken,
    };
  }

  async validateGoogleUser(profile: any) {
    const { id, emails, displayName, photos } = profile;
    const email = emails[0].value;
    const imageUrl = photos?.[0]?.value || null;

    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          name: displayName,
          image: imageUrl,
          role: 'USER',
          emailVerified: true, // Auto-verify Google OAuth users
          provider: 'google',
          providerId: id,
        },
      });

      this.logger.log(`New user via Google OAuth: ${user.email}`);
    } else {
      // Update image if not set
      if (!user.image && imageUrl) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { image: imageUrl, emailVerified: true },
        });
      }
    }

    return user;
  }

  /**
   * Initiate password reset
   */
  async forgotPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return; // Silent - don't reveal whether email exists

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.prisma.verificationToken.create({
      data: {
        userId: user.id,
        token,
        type: 'password_reset',
        expiresAt,
      },
    });

    // TODO: Emit event to send email with reset link
    this.logger.log(`Password reset requested for: ${email}`);
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const resetToken = await this.prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken || resetToken.type !== 'password_reset') {
      throw new BadRequestException('Invalid or expired password reset link');
    }

    if (new Date() > resetToken.expiresAt) {
      await this.prisma.verificationToken.delete({ where: { token } });
      throw new BadRequestException('Password reset link has expired');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      }),
      this.prisma.verificationToken.delete({ where: { token } }),
      // Revoke all existing sessions for security
      this.prisma.session.updateMany({
        where: { userId: resetToken.userId },
        data: { isRevoked: true },
      }),
    ]);

    this.logger.log(`Password reset completed for user: ${resetToken.user.email}`);
  }
}
