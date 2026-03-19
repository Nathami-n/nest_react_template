export const QUEUE_NAMES = {
    PAYMENTS: 'payments',
    PAYOUTS: 'payouts',
    WEBHOOKS: 'webhooks',
    EMAILS: 'emails',
    REFUNDS: 'refunds',
    SUBSCRIPTIONS: 'subscriptions',
    BULK_PAYOUTS: 'bulk-payouts',
} as const;

export type QueueName = typeof QUEUE_NAMES[keyof typeof QUEUE_NAMES];

export const QUEUE_JOBS = {
    // Generic provider-agnostic payment jobs (use these going forward)
    PROCESS_PAYIN: 'process-payin',
    PROCESS_PAYOUT: 'process-payout',

    // Legacy M-Pesa-specific aliases (kept for backward compat — old jobs in queue still carry these names)
    STK_PUSH: 'stk-push',
    B2C_PAYOUT: 'b2c-payout',

    // Email jobs
    SEND_VERIFICATION: 'send-verification',
    SEND_WELCOME: 'send-welcome',
    SEND_PASSWORD_RESET: 'send-password-reset',
    SEND_INVOICE: 'send-invoice',

    // Subscription jobs
    CHARGE_SUBSCRIPTION: 'charge-subscription',
    CHARGE_SETUP_FEE: 'charge-setup-fee',

    // Webhook jobs
    PROCESS_WEBHOOK: 'process-webhook',

    // Sandbox simulation jobs (test-mode only — never enqueued in production)
    SIMULATE_PAYIN_COMPLETION: 'simulate_test_payin_completion',
    SIMULATE_PAYOUT_COMPLETION: 'simulate_test_payout_completion',
    SIMULATE_PAYIN_FAILURE: 'simulate_test_payin_failure',
    SIMULATE_PAYOUT_FAILURE: 'simulate_test_payout_failure',

    // Refund jobs
    PROCESS_REFUND: 'process-refund',

    // Bulk payout jobs
    PROCESS_BULK_PAYOUT: 'process-bulk-payout',
} as const;

export type QueueJob = typeof QUEUE_JOBS[keyof typeof QUEUE_JOBS];
