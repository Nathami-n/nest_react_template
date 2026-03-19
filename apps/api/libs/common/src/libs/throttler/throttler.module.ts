import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerModule as NestThrottlerModule } from "@nestjs/throttler";
import { AppConfigService } from "@app/common/libs/config";
import { SmartThrottlerGuard } from '@app/common/libs/throttler/smart-throttler.guard';

@Module({
    imports: [
        NestThrottlerModule.forRootAsync({
            useFactory: (config: AppConfigService) => ({
                throttlers: [
                    {
                        name: "short",
                        ttl: config.throttleShortTtl,
                        limit: config.throttleShortLimit,
                    },
                    {
                        name: "medium",
                        ttl: config.throttleMediumTtl,
                        limit: config.throttleMediumLimit,
                    },
                    {
                        name: "long",
                        ttl: config.throttleLongTtl,
                        limit: config.throttleLongLimit,
                    },
                ],
            }),
            inject: [AppConfigService],
        }),
    ],
    exports: [NestThrottlerModule],
})
export class ThrottlerModule {
    /**
     * Use this method to register ThrottlerModule with the global guard.
     * Applies SmartThrottlerGuard globally: per-API-key for checkout routes,
     * per-IP for all other routes.
     */
    static forRoot() {
        return {
            module: ThrottlerModule,
            providers: [
                SmartThrottlerGuard,
                {
                    provide: APP_GUARD,
                    useClass: SmartThrottlerGuard,
                },
            ],
        };
    }
}
