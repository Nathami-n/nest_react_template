import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AUTH_STRATEGIES, PASSPORT_FIELDS } from '@app/common';
import { AuthService } from '@api/modules/auth/services';

@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  AUTH_STRATEGIES.LOCAL,
) {
  constructor(private authService: AuthService) {
    super({ usernameField: PASSPORT_FIELDS.USERNAME });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return user;
  }
}
