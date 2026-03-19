import { PrismaModule, SharedConfigModule, CacheModule, ThrottlerModule, QueueModule } from '@app/common/libs';
import { LoggerService } from '@app/common/services';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [
    SharedConfigModule,
    PrismaModule,
    CacheModule.forRoot(),
    ThrottlerModule.forRoot(),
    QueueModule, // BullMQ root configuration
  ],
  providers: [
    LoggerService,
  ],
  exports: [
    LoggerService,

    // modules
    SharedConfigModule,
    PrismaModule,
    CacheModule,
    ThrottlerModule,
    QueueModule,
  ],
})
export class CommonModule { }

