import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AppConfigService } from '@app/common/libs/config/config.service';
import { SharedConfigModule } from '@app/common/libs/config/config.module';

@Module({
    imports: [
        BullModule.forRootAsync({
            imports: [SharedConfigModule],
            useFactory: (config: AppConfigService) => ({
                connection: {
                    host: config.redisHost,
                    port: config.redisPort,
                    password: config.redisPassword,
                },
                defaultJobOptions: {
                    attempts: 3,
                    backoff: {
                        type: 'exponential',
                        delay: 2000,
                    },
                    removeOnComplete: {
                        age: 86400, // Keep completed jobs for 24 hours
                        count: 1000,
                    },
                    removeOnFail: {
                        age: 604800, // Keep failed jobs for 7 days
                    },
                },
            }),
            inject: [AppConfigService],
        }),
    ],
    exports: [BullModule],
})
export class QueueModule { }
