import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { envValidationSchema } from "@app/common/libs/config/env.validation";
import { AppConfigService } from "@app/common/libs/config/config.service";

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: envValidationSchema,
            isGlobal: true,
            envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
            expandVariables: true,
        })
    ],
    providers: [
        AppConfigService,
    ],
    exports: [
        AppConfigService,
    ]
})

export class SharedConfigModule { }