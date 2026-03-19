import { AuthModule } from '@api/modules/auth';
import { ExampleModule } from '@api/modules/example';
import { EmailModule } from '@api/modules/email';
import { UsersModule } from '@api/modules/users';
import { CommonModule, AppConfigService, LoggerService } from '@app/common';
import { Module, OnModuleInit } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bullmq';
import { ApiController } from '@api/api.controller';
import { ApiService } from '@api/api.service';

@Module({
    imports: [
        // Event emitter for domain events
        EventEmitterModule.forRoot({
            global: true,
            wildcard: false,
            delimiter: '.',
            newListener: false,
            removeListener: false,
            maxListeners: 10,
            verboseMemoryLeak: false,
            ignoreErrors: false,
        }),
        // BullMQ for job queues
        BullModule.forRootAsync({
            inject: [AppConfigService],
            useFactory: (config: AppConfigService) => ({
                connection: {
                    host: config.redisHost,
                    port: config.redisPort,
                },
            }),
        }),
        CommonModule,
        AuthModule,
        EmailModule,
        UsersModule,
        ExampleModule,
    ],
    controllers: [ApiController],
    providers: [ApiService],
})
export class ApiModule implements OnModuleInit {
    constructor(
        private readonly config: AppConfigService,
        private readonly logger: LoggerService,
    ) {
        this.logger.setContext(ApiModule.name);
    }

    onModuleInit() {
        this.logger.log(`API initialized in ${this.config.nodeEnv.toUpperCase()} mode`);
    }
}
