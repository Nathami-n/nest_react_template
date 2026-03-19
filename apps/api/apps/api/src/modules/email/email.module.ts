import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QUEUE_NAMES } from '@app/common';
import { EmailService } from '@api/modules/email/services/email.service';
import { AuthEventsListener } from '@api/modules/email/listeners/auth-events.listener';
import { EmailProcessor } from '@api/modules/email/processors/email.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUE_NAMES.EMAILS,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: {
          age: 24 * 3600, // Keep completed jobs for 24 hours
          count: 1000, // Keep last 1000 completed jobs
        },
        removeOnFail: {
          age: 7 * 24 * 3600, // Keep failed jobs for 7 days
        },
      },
    }),
  ],
  providers: [EmailService, EmailProcessor, AuthEventsListener],
  exports: [EmailService],
})
export class EmailModule { }
