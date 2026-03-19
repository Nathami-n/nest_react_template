import {
  AppConfigService,
  AUTH_STRATEGIES,
  COOKIE_NAMES,
  PrismaService,
} from '@app/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  sessionId: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  AUTH_STRATEGIES.JWT,
) {
  constructor(
    private config: AppConfigService,
    private prisma: PrismaService,
  ) {
    const secret = config.jwtSecret;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in configuration');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.[COOKIE_NAMES.ACCESS_TOKEN];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    // Check if session still exists and is not revoked
    const session = await this.prisma.session.findUnique({
      where: { id: payload.sessionId },
      include: { user: true },
    });

    if (!session || session.isRevoked) {
      throw new UnauthorizedException('Session has been revoked');
    }

    const user = session.user;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      role: user.role,
      sessionId: payload.sessionId,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      isActive: user.isActive,
    };
  }
}
