
# Backend Coding Conventions

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: `class-validator`, `class-transformer` (DTOs) + Zod via `@repo/validation`
- **Documentation**: Swagger (OpenAPI)
- **Queue**: BullMQ (`@nestjs/bullmq`)
- **Events**: `@nestjs/event-emitter`

---

## Directory Structure (`apps/api`)

The backend follows a **Modular Architecture**.

- **`apps/api/apps/api/src/modules`**: Domain-specific modules.
- **`apps/api/libs/common/src`**: Shared utilities exported as `@app/common`.
- **`apps/api/prisma`**: Schema, migrations, and one-off scripts.

### Module file structure

```
modules/
  feature/
    controllers/   feature.controller.ts
    services/      feature.service.ts
    listeners/     feature-events.listener.ts   (if consuming domain events)
    dto/           create-feature.dto.ts
    feature.module.ts
```

Register every feature module in `apps/api/apps/api/src/api.module.ts` imports array.

---

## Enums — The Most Important Rule

**Never use raw string literals where an enum exists. Always use the enum member.**

### Enum source

| What                                                                                                                                                                                                                                                                                                                                  | Import from                                               |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `TransactionType`, `TransactionStatus`, `MerchantStatus`, `PaymentMethod`, `Currency`, `WebhookStatus`, `NotificationType`, `NotificationChannel`, `WalletTransactionCategory`, `WalletTransactionType`, `WalletTransactionStatus`, `RefundStatus`, `SubscriptionStatus`, `SubscriptionInterval`, `BulkPayoutStatus`, `InvoiceStatus` | `@repo/validation`                                        |
| Model types (`Merchant`, `User`, `Transaction` …)                                                                                                                                                                                                                                                                                     | `@prisma/client`                                          |
| `AuthProviderType`, `UserRole`                                                                                                                                                                                                                                                                                                        | `@prisma/client` (not yet mirrored in `@repo/validation`) |

> **Rule**: Prefer `@repo/validation` enums over `@prisma/client` enums whenever the enum is defined in both, so the same value is shared across frontend and backend.

### ✅ Correct

```typescript
import { TransactionType, PaymentMethod, MerchantStatus } from '@repo/validation';

if (payload.type === TransactionType.PAYIN) { ... }
if (payload.type === TransactionType.PAYOUT) { ... }
if (merchant.status !== MerchantStatus.APPROVED) { ... }
const method = data.paymentMethod ?? PaymentMethod.MPESA;
metadata: { purpose: TransactionType.WALLET_TOPUP }
```

### ❌ Wrong

```typescript
if (payload.type === 'PAYIN') { ... }      // string literal
if (payload.type === 'PAYOUT') { ... }     // string literal
if (merchant.status !== 'APPROVED') { ... } // string literal
paymentMethod: 'MPESA'                      // string literal
purpose: 'WALLET_TOPUP'                     // string literal
```

### All available enums from `@repo/validation`

```typescript
// Transactions
TransactionType; // PAYIN | PAYOUT | WALLET_TOPUP | COMMISSION | REFUND
TransactionStatus; // PENDING | PROCESSING | COMPLETED | FAILED | CANCELLED | REFUNDED
PaymentMethod; // MPESA | CARD | BANK_TRANSFER
Currency; // KES | USD | EUR | GBP | UGX | TZS | NGN | ZAR | GHS

// Merchants
MerchantStatus; // PENDING | APPROVED | SUSPENDED | REJECTED

// Notifications
NotificationType; // PAYMENT_RECEIVED | PAYOUT_COMPLETED | PAYOUT_FAILED | WALLET_CREDITED
// WALLET_SETTLED | TRANSFER_RECEIVED | SUBSCRIPTION_PAYMENT | INVOICE_PAID | SYSTEM
NotificationChannel; // IN_APP | EMAIL | SMS

// Webhooks
WebhookStatus; // PENDING | SUCCESS | FAILED

// Wallet
WalletTransactionType; // CREDIT | DEBIT
WalletTransactionCategory; // PAYMENT | TOPUP | PAYOUT | SETTLEMENT | FEE | TRANSFER | REFUND | WITHDRAWAL
WalletTransactionStatus; // PENDING | SETTLED

// Refunds
RefundStatus; // PENDING | PROCESSING | COMPLETED | FAILED

// Subscriptions
SubscriptionStatus; // ACTIVE | PAUSED | CANCELLED | EXPIRED | PAST_DUE | TRIALING | PENDING
SubscriptionInterval; // DAILY | WEEKLY | MONTHLY | YEARLY

// Bulk Payouts
BulkPayoutStatus; // PENDING | APPROVED | PROCESSING | COMPLETED | FAILED | CANCELLED

// Invoices
InvoiceStatus; // DRAFT | SENT | PAID | CANCELLED | OVERDUE
```

---

## Shared Packages

### `@app/common`

Provides: `PrismaService`, `LoggerService`, `AppConfigService`, `PaginatedResponseDto`, `buildPaginationMeta`, all domain event classes, `QUEUE_NAMES`, `QUEUE_JOBS`.

### `@repo/validation`

Provides: all enums (preferred source), all shared TypeScript interfaces, Zod schemas.

---

## Paginated Responses

Always use `PaginatedResponseDto` + `buildPaginationMeta` (both from `@app/common`) for any list endpoint.

```typescript
import { PaginatedResponseDto, buildPaginationMeta } from '@app/common';

async findAll(options: { page: number; limit: number }) {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
        this.prisma.item.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
        this.prisma.item.count(),
    ]);

    return new PaginatedResponseDto(items, buildPaginationMeta({ page, limit, total }));
}
```

The `ResponseWrapperInterceptor` detects `{ data: T[], meta: {...} }` and wraps it as:

```json
{
  "success": true,
  "data": [...],
  "meta": { "page": 1, "limit": 20, "total": 100, "totalPages": 5, "hasNextPage": true, "hasPreviousPage": false },
  "timestamp": "..."
}
```

---

## Authentication Pattern in Controllers

```typescript
import { JwtAuthGuard } from "@api/modules/auth/guards";
import type { AuthenticatedUser } from "@repo/validation";

@Controller("resource")
@UseGuards(JwtAuthGuard) // class-level when all routes need auth
export class ResourceController {
  @Get()
  async list(@Req() req: any) {
    const user = req.user as AuthenticatedUser;
    return this.service.findForUser(user.id);
  }
}
```

---

## Domain Events

- Event classes live in `libs/common/src/libs/events/*.events.ts`, decorated `@DomainEvent(name, { version })`.
- Emit with `EventEmitter2.emit(EventClass.name, instance)`.
- Consume with `@OnEvent(EventClass.name)` — **always use the static `.name` property, never a raw string**.
- **Always wrap every `@OnEvent` handler body in try/catch.** Event failures must never crash the primary flow.
- Register listeners as providers in the feature module.

```typescript
@Injectable()
export class FooEventListener {
  private readonly logger = new Logger(FooEventListener.name);

  @OnEvent(SomeDomainEvent.name) // ← static .name, not 'some.event.string'
  async handle(event: SomeDomainEvent) {
    try {
      const payload = event.getPayload();
      // use TransactionType.PAYIN, not 'PAYIN'
    } catch (err) {
      this.logger.error(`Failed to handle SomeDomainEvent: ${err.message}`);
    }
  }
}
```

---

## Logger

Use `LoggerService` from `@app/common` (wraps Pino). Inject it and call `this.logger.setContext(ClassName.name)` in the constructor.

```typescript
constructor(private readonly logger: LoggerService) {
    this.logger.setContext(MyService.name);
}
```

---

## Error Handling

Throw NestJS HTTP exceptions from services. The global `HttpExceptionFilter` formats them consistently.

```typescript
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from "@nestjs/common";

if (!item) throw new NotFoundException("Item not found");
if (exists) throw new ConflictException("Item already exists");
if (!allowed) throw new ForbiddenException("Access denied");
if (invalid) throw new BadRequestException("Reason for failure");
```

---

## Response Shape Overview

| Return type      | Return from controller              | Final wire shape                                   |
| ---------------- | ----------------------------------- | -------------------------------------------------- |
| Single resource  | Plain object / class instance       | `{ success, data: {...}, timestamp }`              |
| Paginated list   | `PaginatedResponseDto(items, meta)` | `{ success, data: [...], meta: {...}, timestamp }` |
| No content (204) | `void` + `@HttpCode(NO_CONTENT)`    | —                                                  |

---

## One-off Database Scripts

Place backfill/migration scripts in `apps/api/prisma/scripts/*.ts`.

Run with:

```bash
cd apps/api
npx ts-node -r tsconfig-paths/register --project tsconfig.json prisma/scripts/my-script.ts
```

---

## Database & Prisma

- Schema: `apps/api/prisma/schema.prisma`
- Model names: PascalCase (`User`, `PaymentLink`)
- Field names: camelCase (`firstName`, `isActive`)
- Table names: plural snake_case via `@@map` (`@@map("payment_links")`)
- Always generate a migration after schema changes (`prisma migrate dev --name description`)
- `PrismaService` is global (via `PrismaModule` which is `@Global()`) — inject directly, no need to import `PrismaModule` in every module.
