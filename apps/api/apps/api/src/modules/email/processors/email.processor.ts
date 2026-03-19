import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { LoggerService, QUEUE_JOBS, QUEUE_NAMES } from '@app/common';
import { EmailService } from '@api/modules/email/services/email.service';

interface VerificationEmailPayload {
    email: string;
    otp: string;
    userName?: string;
}

interface WelcomeEmailPayload {
    email: string;
    userName: string;
}

interface PasswordResetEmailPayload {
    email: string;
    resetUrl: string;
    userName?: string;
}

@Processor(QUEUE_NAMES.EMAILS, {
    concurrency: 5,
})
export class EmailProcessor extends WorkerHost {
    constructor(
        private readonly emailService: EmailService,
        private readonly logger: LoggerService,
    ) {
        super();
        this.logger.setContext(EmailProcessor.name);
    }

    async process(job: Job): Promise<void> {
        this.logger.log(
            `Processing email job: ${job.name} (ID: ${job.id})`,
        );

        try {
            switch (job.name) {
                case QUEUE_JOBS.SEND_VERIFICATION:
                    await this.processVerificationEmail(job.data as VerificationEmailPayload);
                    break;

                case QUEUE_JOBS.SEND_WELCOME:
                    await this.processWelcomeEmail(job.data as WelcomeEmailPayload);
                    break;

                case QUEUE_JOBS.SEND_PASSWORD_RESET:
                    await this.processPasswordResetEmail(job.data as PasswordResetEmailPayload);
                    break;

                default:
                    this.logger.warn(`Unknown job type: ${job.name}`);
            }

            this.logger.log(`Job ${job.name} (ID: ${job.id}) completed successfully`);
        } catch (error) {
            this.logger.error(
                `Job ${job.name} (ID: ${job.id}) failed:`,
                error,
            );
            throw error; // Let BullMQ handle retries
        }
    }

    private async processVerificationEmail(data: VerificationEmailPayload): Promise<void> {
        await this.emailService.sendVerificationEmailImmediate(
            data.email,
            data.otp,
            data.userName,
        );
    }

    private async processWelcomeEmail(data: WelcomeEmailPayload): Promise<void> {
        await this.emailService.sendWelcomeEmailImmediate(
            data.email,
            data.userName,
        );
    }

    private async processPasswordResetEmail(data: PasswordResetEmailPayload): Promise<void> {
        await this.emailService.sendPasswordResetEmailImmediate(
            data.email,
            data.resetUrl,
            data.userName,
        );
    }
}
