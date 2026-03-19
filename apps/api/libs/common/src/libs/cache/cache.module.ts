import { DynamicModule, Global, Module } from "@nestjs/common";
import { CacheService } from '@app/common/libs/cache/cache.service';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';

export interface CacheModuleOptions {
    ttl?: number;
    max?: number;
    isGlobal?: boolean;
}

@Global()
@Module({
})
export class CacheModule {
    static forRoot(options?: CacheModuleOptions): DynamicModule {
        const ttl = options?.ttl || parseInt(process.env.CACHE_TTL || '3600', 10);
        const max = options?.max || parseInt(process.env.CACHE_MAX || '100', 10);
        const isGlobal = options?.isGlobal || false;

        return {
            module: CacheModule,
            imports: [
                NestCacheModule.register({
                    isGlobal,
                    ttl: ttl * 1000,
                    max
                })
            ],
            providers: [CacheService],
            exports: [CacheService, NestCacheModule]
        }
    }
}