export type ChangelogTag = "Feature" | "Fix" | "Improvement" | "Announcement";

export interface ChangelogEntry {
  id: string;
  date: string;
  tag: ChangelogTag;
  title: string;
  description: string;
}

export const changelogData: ChangelogEntry[] = [

  {
    id: "wallet-system",
    date: "2026-03-02",
    tag: "Feature",
    title: "Merchant Wallet System",
    description:
      "Every merchant now has a dedicated wallet with real-time available and pending balance tracking. Top up instantly via M-Pesa, receive incoming payments with a 24-hour settlement hold, and withdraw directly to your M-Pesa account.",
  },
  {
    id: "invoicing-live",
    date: "2026-03-01",
    tag: "Feature",
    title: "Invoicing is Live!",
    description:
      "You can now create, manage, and instantly send professional invoices directly to your customers. It completely integrates with M-Pesa STK push for fast payments.",
  },
  {
    id: "bulk-payouts-csv",
    date: "2026-02-28",
    tag: "Feature",
    title: "Bulk Payouts via CSV",
    description:
      "Launch your payouts faster. Upload a CSV of phone numbers and amounts to easily process hundreds of B2C payouts via M-Pesa simultaneously.",
  },
  {
    id: "withdrawal-limits",
    date: "2026-02-20",
    tag: "Feature",
    title: "Withdrawal Rate Limits",
    description:
      "Added configurable per-merchant withdrawal limits to protect against large unauthorized withdrawals. Limits are enforced at 20,000/hour and 100,000/day by default, helping keep merchant funds secure.",
  },
  {
    id: "payment-links",
    date: "2026-02-15",
    tag: "Feature",
    title: "Shareable Payment Links",
    description:
      "Easily generate and share payment links online without writing any code. Every link comes with a beautifully hosted checkout page and instant QR codes.",
  },
  {
    id: "settlement-engine",
    date: "2026-02-08",
    tag: "Improvement",
    title: "Hourly Balance Settlement Engine",
    description:
      "Incoming PAYIN transactions now move through a 24-hour hold period before becoming available. A background settlement cron runs every hour to automatically release funds, giving merchants accurate, up-to-date available balances.",
  },
  {
    id: "subscription-billing",
    date: "2026-01-20",
    tag: "Feature",
    title: "Subscription Engine",
    description:
      "Turn your customers into recurring revenue. Create complex subscription plans with automated trials, recurring charges, and automatic transaction retries.",
  },
];
