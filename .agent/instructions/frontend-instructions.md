# Frontend Coding Conventions

## Tech Stack

- **Framework**: React 19 (via React Router v7 / Remix)
- **Styling**: TailwindCSS
- **UI Component Library**: Shadcn UI (`packages/ui`, import from `@repo/ui/components`)
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form + Zod (via `@repo/form-engine`)
- **Icons**: Hugeicons (`@hugeicons/core-free-icons` + `@hugeicons/react`)
- **Notifications / Toasts**: `sonner`

---

## Directory Structure (`apps/web`)

The frontend follows a **Feature-based Architecture**.

- **`app/features`**: Domain logic. Each feature folder contains:
  - `api/`: Raw `apiClient` calls with typed inputs/outputs.
  - `queries/`: `useQuery` wrappers.
  - `mutations/`: `useMutation` wrappers.
  - `components/`: Feature-specific UI — no direct API calls here.
  - `registry/`: Modular content maps (e.g., notification type → display config).
  - `index.ts`: Re-exports the public surface.
- **`app/routes`**: Route files. Delegate rendering to feature components. Avoid logic here.
- **`app/layouts`**: Global/section layouts (`dashboard.tsx`, `settings.tsx`).
- **`app/lib`**: Shared helpers — `apiClient`, `queryKeys`, utilities.

---

## Enums — The Most Important Rule

**Never use raw string literals where an enum exists. Always use the enum member.**

All enums are imported from `@repo/validation`.

### ✅ Correct

```typescript
import {
  TransactionType,
  TransactionStatus,
  MerchantStatus,
  PaymentMethod,
} from "@repo/validation";

type === TransactionType.PAYIN;
status === TransactionStatus.COMPLETED;
merchant.status === MerchantStatus.APPROVED;
paymentMethod === PaymentMethod.MPESA;
```

### ❌ Wrong

```typescript
type === "PAYIN";
status === "COMPLETED";
merchant.status === "APPROVED";
```

### Available enums from `@repo/validation`

```typescript
TransactionType; // PAYIN | PAYOUT | WALLET_TOPUP | COMMISSION | REFUND
TransactionStatus; // PENDING | PROCESSING | COMPLETED | FAILED | CANCELLED | REFUNDED
MerchantStatus; // PENDING | APPROVED | SUSPENDED | REJECTED
PaymentMethod; // MPESA | CARD | BANK_TRANSFER
Currency; // KES | USD | EUR | GBP | UGX | TZS | NGN | ZAR | GHS
WebhookStatus; // PENDING | SUCCESS | FAILED
NotificationType; // PAYMENT_RECEIVED | PAYOUT_COMPLETED | PAYOUT_FAILED | WALLET_CREDITED
// WALLET_SETTLED | TRANSFER_RECEIVED | SUBSCRIPTION_PAYMENT | INVOICE_PAID | SYSTEM
NotificationChannel; // IN_APP | EMAIL | SMS
WalletTransactionType; // CREDIT | DEBIT
WalletTransactionCategory; // PAYMENT | TOPUP | PAYOUT | SETTLEMENT | FEE | TRANSFER | REFUND | WITHDRAWAL
WalletTransactionStatus; // PENDING | SETTLED
RefundStatus; // PENDING | PROCESSING | COMPLETED | FAILED
SubscriptionStatus; // ACTIVE | PAUSED | CANCELLED | EXPIRED | PAST_DUE | TRIALING | PENDING
SubscriptionInterval; // DAILY | WEEKLY | MONTHLY | YEARLY
BulkPayoutStatus; // PENDING | APPROVED | PROCESSING | COMPLETED | FAILED | CANCELLED
InvoiceStatus; // DRAFT | SENT | PAID | CANCELLED | OVERDUE
```

---

## Shared Packages

### `@repo/ui/components`

All primitive UI components (Button, Card, Badge, Dialog, Popover, Tabs, etc.). Never create local copies.

### `@repo/validation`

All enums, shared TypeScript interfaces, and Zod schemas. Single source of truth shared between frontend and backend.

### `@repo/api` (`apiClient`)

All HTTP calls go through `apiClient` imported from `@/lib`. It handles base URL, cookies, and error normalisation.

### `@repo/form-engine`

Use for all complex forms (`useFormEngine`, `FormConfig`). Standardises validation, rendering, and error handling.

---

## API Layer

### Typed requests and responses

```typescript
import { apiClient } from "@/lib";
import type { PaginatedApiResponse, MyItem } from "@repo/validation";

export const myFeatureApi = {
  list: (params?: ListParams): Promise<PaginatedApiResponse<MyItem>> =>
    apiClient.get(`/my-feature?${new URLSearchParams(params as any)}`),

  create: (data: CreateMyItemInput): Promise<MyItem> =>
    apiClient.post("/my-feature", data),

  update: (id: string, data: UpdateMyItemInput): Promise<MyItem> =>
    apiClient.patch(`/my-feature/${id}`, data),

  delete: (id: string): Promise<void> => apiClient.delete(`/my-feature/${id}`),
};
```

### Paginated responses

All paginated endpoints return `PaginatedApiResponse<T>` from `@repo/validation`:

```typescript
// PaginationMeta shape:
// { page, limit, total, totalPages, hasNextPage, hasPreviousPage }
// Drive pagination controls from hasNextPage / hasPreviousPage booleans.
```

---

## Query Keys

All React Query keys are centralised in `app/lib/query-keys.ts`. Always add keys there and import `queryKeys` from `@/lib`. **Never inline raw string arrays as query keys.**

```typescript
import { queryKeys } from "@/lib";

useQuery({ queryKey: queryKeys.myFeature.list(filters) });
```

---

## Mutations

### Cache invalidation

Always invalidate the full query family on success:

```typescript
onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.myFeature.all });
},
```

### User feedback

Always give feedback via `toast` from `sonner`:

```typescript
onSuccess: () => toast.success('Item created.'),
onError:   () => toast.error('Something went wrong. Please try again.'),
```

---

## Components

- **Functional Components**: `function ComponentName() {}` — no arrow-function component exports at file level.
- **Props**: Always define an explicit `interface Props { ... }`.
- **No `any`**: Define interfaces for all data. Use shared types from `@repo/validation`.
- **Responsiveness**: Tailwind responsive prefixes (`md:`, `lg:`) — no JS-based media query hooks.
- **Icons**: `HugeiconsIcon` from `@hugeicons/react` + icon from `@hugeicons/core-free-icons`.

```tsx
import { HugeiconsIcon } from "@hugeicons/react";
import { SomeIcon } from "@hugeicons/core-free-icons";

<HugeiconsIcon icon={SomeIcon} className="size-5" />;
```

---

## Routing

- Register routes in `app/routes.ts`.
- Route files delegate rendering to feature components; avoid business logic in route files.
- Use `Link`, `NavLink`, `useNavigate` from `react-router`.

---

## Forms

Use `@repo/form-engine` for all complex forms:

```typescript
import { useFormEngine } from '@repo/form-engine';
import { mySchema } from '@repo/validation';

const { form, fields } = useFormEngine({ schema: mySchema, fields: [...] });
```

---

## Registry Pattern

When a component renders different content based on an enum value (e.g. notification types, transaction types), extract a registry object instead of long switch/if chains:

```typescript
// features/notifications/registry/notification-registry.ts
type NotificationDef = {
    icon: IconType;
    color: string;          // Tailwind bg class
    getTitle: (meta: any) => string;
    getBody:  (meta: any) => string;
    getLink?: (meta: any) => string;
};

export const NOTIFICATION_REGISTRY: Record<NotificationType, NotificationDef> = {
    [NotificationType.PAYMENT_RECEIVED]: { ... },
    // one entry per enum value — TypeScript enforces exhaustiveness
};
```

The structural component stays generic; only content changes per type.

---

## Polling / Real-time Data

```typescript
useQuery({
  queryKey: queryKeys.notifications.unreadCount(),
  queryFn: notificationsApi.getUnreadCount,
  refetchInterval: 30_000, // ms
});
```

---

## State Management

- **Server state**: `useQuery` / `useMutation` (TanStack Query).
- **Local UI state**: `useState`, `useReducer`.
- **Global client state**: Rely on URL state and React Query cache. No Redux/Zustand unless absolutely necessary.
