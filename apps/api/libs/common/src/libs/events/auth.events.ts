import { BaseEvent, DomainEvent } from '@app/common/libs/events/base-event';

/**
 * Authentication & Authorization Events
 * Emitted when auth-related operations occur
 */

@DomainEvent('auth.user.signed_up', { version: 1 })
export class UserSignedUpEvent extends BaseEvent {
  constructor(
    private readonly data: {
      userId: string;
      email: string;
      name: string;
      provider: string;
      needsEmailVerification: boolean;
    },
  ) {
    super(data.userId);
  }

  getPayload() {
    return this.data;
  }
}

@DomainEvent('auth.email_verification.requested', { version: 1 })
export class EmailVerificationRequestedEvent extends BaseEvent {
  constructor(
    private readonly data: {
      email: string;
      userId?: string;
    },
  ) {
    super(data.userId);
  }

  getPayload() {
    return this.data;
  }
}

@DomainEvent('auth.email_verification.completed', { version: 1 })
export class EmailVerificationCompletedEvent extends BaseEvent {
  constructor(
    private readonly data: {
      userId: string;
      email: string;
      verifiedAt: Date;
    },
  ) {
    super(data.userId);
  }

  getPayload() {
    return this.data;
  }
}

@DomainEvent('auth.otp.resend_requested', { version: 1 })
export class OTPResendRequestedEvent extends BaseEvent {
  constructor(
    private readonly data: {
      email: string;
    },
  ) {
    super();
  }

  getPayload() {
    return this.data;
  }
}

@DomainEvent('auth.user.logged_in', { version: 1 })
export class UserLoggedInEvent extends BaseEvent {
  constructor(
    private readonly data: {
      userId: string;
      email: string;
      provider: string;
    },
  ) {
    super(data.userId);
  }

  getPayload() {
    return this.data;
  }
}

@DomainEvent('auth.password_reset.requested', { version: 1 })
export class PasswordResetRequestedEvent extends BaseEvent {
  constructor(
    private readonly data: {
      userId: string;
      email: string;
      token: string;
    },
  ) {
    super(data.userId);
  }

  getPayload() {
    return this.data;
  }
}
