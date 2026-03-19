import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { AppConfigService, LoggerService, QUEUE_JOBS, QUEUE_NAMES } from '@app/common';
import { render } from '@react-email/render';
import * as nodemailer from 'nodemailer';
import { Resend } from 'resend';

import VerifyEmail from '@api/modules/email/templates/verify-email';
import WelcomeEmail from '@api/modules/email/templates/welcome';
import PasswordResetEmail from '@api/modules/email/templates/password-reset';

@Injectable()
export class EmailService {
  private nodemailerTransport: nodemailer.Transporter | null = null;
  private resend: Resend | null = null;

  constructor(
    private readonly config: AppConfigService,
    private readonly logger: LoggerService,
    @InjectQueue(QUEUE_NAMES.EMAILS) private emailQueue: Queue,
  ) {
    this.logger.setContext(EmailService.name);
    this.initializeTransport();
  }

  /**
   * Initialize email transport based on environment
   * - Production: Uses Resend API
   * - Development: Uses MailHog
   */
  private initializeTransport() {
    const isProduction = this.config.isProduction;
    const resendApiKey = this.config.resendApiKey;

    this.logger.log(
      `Initializing EmailService. Environment: ${this.config.nodeEnv}`,
    );

    if (isProduction && resendApiKey) {
      // Production: Use Resend
      this.resend = new Resend(resendApiKey);
      this.logger.log('Email service initialized with Resend (Production)');
    } else if (isProduction && !resendApiKey) {
      // Production but no API key - log critical error
      this.logger.error(
        'CRITICAL: RESEND_API_KEY is missing in production environment!',
      );
      this.logger.warn(
        'Falling back to MailHog - Emails will NOT be delivered to users!',
      );
    }

    if (!this.resend) {
      // Development or Fallback: Use MailHog
      this.nodemailerTransport = nodemailer.createTransport({
        host: this.config.mailhogHost,
        port: this.config.mailhogPort,
        ignoreTLS: true,
      });
      this.logger.log(
        `Email service initialized with MailHog (${this.config.mailhogHost}:${this.config.mailhogPort})`,
      );
    }
  }

  /**
   * Queue verification email (uses BullMQ)
   */
  async sendVerificationEmail(
    email: string,
    otp: string,
    userName?: string,
  ): Promise<void> {
    await this.emailQueue.add(QUEUE_JOBS.SEND_VERIFICATION, {
      email,
      otp,
      userName,
    });
    this.logger.log(`Queued verification email for ${email}`);
  }

  /**
   *  Send verification email immediately (called by processor)
   */
  async sendVerificationEmailImmediate(
    email: string,
    otp: string,
    userName?: string,
  ): Promise<void> {
    const html = await render(
      VerifyEmail({
        otp,
        userName,
        expiresInMinutes: 10,
      }),
    );

    const subject = 'Verify your email address';
    const from = `${this.config.mailFromName} <${this.config.mailFrom}>`;

    try {
      if (this.resend) {
        this.logger.debug(`Sending verification email via Resend to ${email}`);
        await this.resend.emails.send({
          from,
          to: email,
          subject,
          html,
        });
        this.logger.log(`Verification email sent via Resend to ${email}`);
      } else if (this.nodemailerTransport) {
        this.logger.debug(`Sending verification email via MailHog to ${email}`);
        await this.nodemailerTransport.sendMail({
          from,
          to: email,
          subject,
          html,
        });
        this.logger.log(`Verification email sent via MailHog to ${email}`);
      } else {
        this.logger.error('No email transport configured!');
        throw new Error('Email service not configured');
      }
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${email}:`, error);
      throw error;
    }
  }

  /**
   * Queue welcome email (uses BullMQ)
   */
  async sendWelcomeEmail(email: string, userName: string): Promise<void> {
    await this.emailQueue.add(QUEUE_JOBS.SEND_WELCOME, {
      email,
      userName,
    });
    this.logger.log(`Queued welcome email for ${email}`);
  }

  /**
   * Send welcome email immediately (called by processor)
   */
  async sendWelcomeEmailImmediate(email: string, userName: string): Promise<void> {
    const html = await render(
      WelcomeEmail({
        userName,
        loginUrl: `${this.config.frontendUrl}/auth/login`,
      }),
    );

    const subject = 'Welcome!';
    const from = `${this.config.mailFromName} <${this.config.mailFrom}>`;

    try {
      if (this.resend) {
        await this.resend.emails.send({
          from,
          to: email,
          subject,
          html,
        });
      } else if (this.nodemailerTransport) {
        await this.nodemailerTransport.sendMail({
          from,
          to: email,
          subject,
          html,
        });
      }
      this.logger.log(`Welcome email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}:`, error);
      // Don't throw - welcome email is not critical
    }
  }

  /**
   * Queue password reset email (uses BullMQ)
   */
  async sendPasswordResetEmail(
    email: string,
    resetUrl: string,
    userName?: string,
  ): Promise<void> {
    await this.emailQueue.add(QUEUE_JOBS.SEND_PASSWORD_RESET, {
      email,
      resetUrl,
      userName,
    });
    this.logger.log(`Queued password reset email for ${email}`);
  }

  /**
   * Send password reset email immediately (called by processor)
   */
  async sendPasswordResetEmailImmediate(
    email: string,
    resetUrl: string,
    userName?: string,
  ): Promise<void> {
    const html = await render(
      PasswordResetEmail({
        resetUrl,
        userName,
      }),
    );

    const subject = 'Reset your password';
    const from = `${this.config.mailFromName} <${this.config.mailFrom}>`;

    try {
      if (this.resend) {
        await this.resend.emails.send({
          from,
          to: email,
          subject,
          html,
        });
      } else if (this.nodemailerTransport) {
        await this.nodemailerTransport.sendMail({
          from,
          to: email,
          subject,
          html,
        });
      }
      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${email}:`, error);
      throw error;
    }
  }
}
