import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
    EmailVerificationRequestedEvent,
    EmailVerificationCompletedEvent,
    OTPResendRequestedEvent,
    LoggerService,
    UserLoggedInEvent,
    UserSignedUpEvent,
    PasswordResetRequestedEvent,
    AppConfigService,
    PrismaService,
    AUTH_STRATEGIES,
} from '@app/common';
import { EmailService } from '@api/modules/email/services/email.service';

@Injectable()
export class AuthEventsListener {
    constructor(
        private readonly prisma: PrismaService,
        private readonly emailService: EmailService,
        private readonly config: AppConfigService,
        private logger: LoggerService,
    ) {
        this.logger.setContext(AuthEventsListener.name);
    }

    @OnEvent(UserLoggedInEvent.name)
    async handleUserLoggedInEvent(event: UserLoggedInEvent) {
        this.logger.log('Handling UserLoggedInEvent');

        const payload = event.getPayload();
        const { userId, provider } = payload;

        try {
            // For OAuth providers, mark email as verified
            if (provider === AUTH_STRATEGIES.GOOGLE) {
                await this.prisma.user.update({
                    where: { id: userId },
                    data: { emailVerified: true },
                });
            }
        } catch (error) {
            this.logger.error(
                `Error handling UserLoggedInEvent: ${error.message}`,
                error.stack,
            );
        }
    }

    @OnEvent(UserSignedUpEvent.name)
    async handleUserSignedUpEvent(event: UserSignedUpEvent) {
        this.logger.log('Handling UserSignedUpEvent');
        const payload = event.getPayload();
        const { email, userId, provider } = payload;

        try {
            // If user signed up via Google, send welcome email immediately
            // For email/password, welcome email is sent after verification
            if (provider === AUTH_STRATEGIES.GOOGLE) {
                const user = await this.prisma.user.findUnique({
                    where: { id: userId },
                    select: { name: true },
                });

                if (!user) {
                    this.logger.warn(`User ${userId} not found for welcome email`);
                    return;
                }

                await this.emailService.sendWelcomeEmail(email, user.name || 'there');
            }
        } catch (error) {
            this.logger.error(
                `Error handling UserSignedUpEvent: ${error.message}`,
                error.stack,
            );
        }
    }

    @OnEvent(EmailVerificationRequestedEvent.name)
    async handleEmailVerificationRequested(
        event: EmailVerificationRequestedEvent,
    ) {
        this.logger.log('Handling EmailVerificationRequestedEvent');

        const payload = event.getPayload();
        const { email, userId } = payload;

        try {
            // Generate OTP
            const otp = this.generateOTP();

            // Find user to get their name
            const user = await this.prisma.user.findUnique({
                where: { email },
                select: { name: true },
            });

            // Delete any existing verification tokens for this user
            if (userId) {
                await this.prisma.verificationToken.deleteMany({
                    where: {
                        userId,
                        type: 'email_verification',
                    },
                });
            }

            // Create new verification token
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minutes expiration

            if (userId) {
                await this.prisma.verificationToken.create({
                    data: {
                        userId,
                        token: otp,
                        type: 'email_verification',
                        expiresAt,
                    },
                });
            }

            // Send verification email
            await this.emailService.sendVerificationEmail(
                email,
                otp,
                user?.name ?? undefined,
            );

            this.logger.log(`Verification email sent to ${email}`);
        } catch (error) {
            this.logger.error(
                `Error handling EmailVerificationRequestedEvent: ${error.message}`,
                error.stack,
            );
            throw error;
        }
    }

    @OnEvent(EmailVerificationCompletedEvent.name)
    async handleEmailVerificationCompleted(
        event: EmailVerificationCompletedEvent,
    ) {
        this.logger.log('Handling EmailVerificationCompletedEvent');

        const payload = event.getPayload();
        const { email, userId } = payload;

        try {
            // Get user details
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { name: true },
            });

            if (!user) {
                this.logger.warn(`User ${userId} not found for welcome email`);
                return;
            }

            // Send welcome email
            await this.emailService.sendWelcomeEmail(email, user.name || 'there');

            this.logger.log(`Welcome email sent to ${email}`);
        } catch (error) {
            this.logger.error(
                `Error handling EmailVerificationCompletedEvent: ${error.message}`,
                error.stack,
            );
            // Don't throw here - welcome email is not critical
        }
    }

    @OnEvent(OTPResendRequestedEvent.name)
    async handleOTPResendRequested(event: OTPResendRequestedEvent) {
        this.logger.log('Handling OTPResendRequested Event');

        const payload = event.getPayload();
        const { email } = payload;

        try {
            // Find user
            const user = await this.prisma.user.findUnique({
                where: { email },
                select: { id: true, name: true },
            });

            if (!user) {
                this.logger.warn(`No user found for ${email}`);
                return;
            }

            // Generate new OTP
            const otp = this.generateOTP();

            // Delete old tokens
            await this.prisma.verificationToken.deleteMany({
                where: {
                    userId: user.id,
                    type: 'email_verification',
                },
            });

            // Create new token
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 10);

            await this.prisma.verificationToken.create({
                data: {
                    userId: user.id,
                    token: otp,
                    type: 'email_verification',
                    expiresAt,
                },
            });

            // Send verification email
            await this.emailService.sendVerificationEmail(email, otp, user.name ?? undefined);

            this.logger.log(`OTP resent to ${email}`);
        } catch (error) {
            this.logger.error(
                `Error handling OTPResendRequestedEvent: ${error.message}`,
                error.stack,
            );
            throw error;
        }
    }

    @OnEvent(PasswordResetRequestedEvent.name)
    async handlePasswordResetRequested(event: PasswordResetRequestedEvent) {
        this.logger.log('Handling PasswordResetRequestedEvent');

        const payload = event.getPayload();
        const { email, token } = payload;

        try {
            // Get user details
            const user = await this.prisma.user.findUnique({
                where: { email },
                select: { name: true },
            });

            // Build reset URL
            const resetUrl = `${this.config.frontendUrl}/auth/reset-password?token=${token}`;

            // Send password reset email
            await this.emailService.sendPasswordResetEmail(
                email,
                resetUrl,
                user?.name ?? undefined,
            );

            this.logger.log(`Password reset email sent to ${email}`);
        } catch (error) {
            this.logger.error(
                `Error handling PasswordResetRequestedEvent: ${error.message}`,
                error.stack,
            );
            throw error;
        }
    }

    /**
     * Generate a 6-digit OTP
     */
    private generateOTP(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}
