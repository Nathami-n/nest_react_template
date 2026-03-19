import { Injectable, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService, LoggerService } from '@app/common';

@Injectable()
export class VerificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(VerificationService.name);
  }

  /**
   * Verify email with OTP
   */
  async verifyEmail(email: string, otp: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const token = await this.prisma.verificationToken.findFirst({
      where: {
        userId: user.id,
        token: otp,
        type: 'email_verification',
      },
    });

    if (!token) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Check if expired
    if (new Date() > token.expiresAt) {
      await this.prisma.verificationToken.delete({
        where: { id: token.id },
      });
      throw new BadRequestException('OTP has expired. Please request a new one.');
    }

    // Mark user as verified and delete token
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true },
      }),
      this.prisma.verificationToken.delete({
        where: { id: token.id },
      }),
    ]);

    this.logger.log(`Email verified: ${email}`);
    return true;
  }

  /**
   * Resend OTP
   */
  async resendOTP(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Email not found');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Delete old tokens
    await this.prisma.verificationToken.deleteMany({
      where: {
        userId: user.id,
        type: 'email_verification',
      },
    });

    // Create new token
    await this.prisma.verificationToken.create({
      data: {
        userId: user.id,
        token: otp,
        type: 'email_verification',
        expiresAt,
      },
    });

    // TODO: Emit event to send email with OTP
    this.logger.log(`OTP resent for: ${email}`);
  }
}
