import { AuthController } from '@api/modules/auth/controllers';
import { RolesGuard } from '@api/modules/auth/guards';
import { AuthService } from '@api/modules/auth/services';
import { VerificationService } from '@api/modules/auth/services/verification.service';
import { GoogleStrategy, JwtStrategy, LocalStrategy } from '@api/modules/auth/strategies';
import { AppConfigService } from '@app/common';
import { Module } from '@nestjs/common';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            useFactory: (config: AppConfigService) => ({
                secret: config.jwtSecret,
                signOptions: { expiresIn: config.jwtExpiration } as JwtSignOptions,
            }),
            inject: [AppConfigService],
        }),
    ],
    providers: [
        AuthService,
        VerificationService,
        LocalStrategy,
        JwtStrategy,
        GoogleStrategy,
        RolesGuard,
    ],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule { }
