import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AUTH_STRATEGIES } from '@app/common';

@Injectable()
export class LocalAuthGuard extends AuthGuard(AUTH_STRATEGIES.LOCAL) { }

@Injectable()
export class JwtAuthGuard extends AuthGuard(AUTH_STRATEGIES.JWT) { }

@Injectable()
export class GoogleAuthGuard extends AuthGuard(AUTH_STRATEGIES.GOOGLE) { }

export * from '@api/modules/auth/guards/roles.guard';
