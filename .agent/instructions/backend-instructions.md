# Backend Development Guide (NestJS + Prisma)

## Tech Stack

- **Framework**: NestJS 11
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Passport.js + JWT
- **Validation**: `class-validator`, `class-transformer` (DTOs) + Zod via `@repo/validation`
- **Documentation**: Swagger (OpenAPI)
- **Queue**: BullMQ (`@nestjs/bullmq`) - Optional
- **Events**: `@nestjs/event-emitter`
- **Email**: React Email with React 19
- **Caching**: `@nestjs/cache-manager` + `cache-manager`

---

## Critical Rules

### 1. **ALWAYS Use Absolute Imports**

❌ **NEVER** use relative imports:

```typescript
import { SomeService } from "../../services/some.service"; // WRONG
import { MyDto } from "./dto/my.dto"; // WRONG
```

✅ **ALWAYS** use absolute imports with path aliases:

```typescript
import { SomeService } from "@api/modules/feature/services/some.service";
import { MyDto } from "@api/modules/feature/dto/my.dto";
import { PrismaService } from "@app/common/database/prisma.service";
import { UserRole, USER_ROLES } from "@repo/validation";
```

**Path Aliases Available:**

- `@api/*` → `apps/api/src/*`
- `@app/common/*` → `apps/api/libs/common/src/*`
- `@repo/*` → `packages/*`

### 2. **Enum Usage - The Most Important Rule**

**NEVER use string literals where enums exist. ALWAYS use the enum member.**

#### Enum Sources

| Enum Type    | Import From        | Example Usage                  |
| ------------ | ------------------ | ------------------------------ |
| `UserRole`   | `@repo/validation` | `user.role === UserRole.ADMIN` |
| `USER_ROLES` | `@repo/validation` | `USER_ROLES.PLATFORM_ADMIN`    |

✅ **Correct:**

```typescript
import { UserRole, USER_ROLES } from '@repo/validation';

// In decorators
@Roles(UserRole.ADMIN, UserRole.PLATFORM_ADMIN)

// In conditionals
if (user.role === UserRole.ADMIN) { ... }

// In Prisma queries
where: { role: UserRole.USER }

// In DTOs
@IsEnum(UserRole)
role: UserRole;
```

❌ **Wrong:**

```typescript
if (user.role === 'ADMIN') { ... } // String literal - NEVER DO THIS
@Roles('ADMIN', 'PLATFORM_ADMIN') // String literals
where: { role: 'USER' } // String literal
```

### 3. **Prisma Client Initialization**

For **scripts** (seed.ts, one-off tasks), always use `PrismaPg` adapter:

```typescript
import { PrismaClient, UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});
```

For **services** (NestJS modules), inject `PrismaService`:

```typescript
constructor(private readonly prisma: PrismaService) {}
```

---

## Directory Structure (`apps/api`)

### Module Structure

```
apps/api/
├── apps/api/src/
│   ├── modules/              # Feature modules
│   │   ├── auth/
│   │   │   ├── controllers/  # HTTP endpoints
│   │   │   ├── services/     # Business logic
│   │   │   ├── strategies/   # Passport strategies
│   │   │   ├── guards/       # Authorization guards
│   │   │   ├── decorators/   # Custom decorators
│   │   │   ├── dto/          # Data transfer objects
│   │   │   └── auth.module.ts
│   │   ├── example/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── dto/
│   │   │   └── example.module.ts
│   │   └── email/
│   │       ├── services/
│   │       ├── templates/    # React Email templates
│   │       └── email.module.ts
│   ├── api.module.ts         # Root module
│   ├── api.controller.ts     # Health check
│   └── main.ts               # Bootstrap
├── libs/common/src/          # Shared library (@app/common)
│   ├── config/               # Configuration
│   ├── database/             # Prisma service
│   ├── events/               # Domain events
│   ├── libs/                 # Cache, queue, etc.
│   ├── filters/              # Exception filters
│   ├── interceptors/         # Response interceptor
│   ├── pipes/                # Validation pipes
│   ├── types/                # Shared types
│   ├── constants/            # Constants
│   └── utils/                # Utilities
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── migrations/           # DB migrations
│   └── seed.ts               # Seed data
└── package.json
```

---

## Creating a New Feature Module

### 1. Generate Module Structure

```bash
cd apps/api
nest g module modules/feature-name
nest g controller modules/feature-name/controllers/feature-name
nest g service modules/feature-name/services/feature-name
```

### 2. Create Module Files

**`feature-name.module.ts`:**

```typescript
import { Module } from "@nestjs/common";
import { FeatureNameController } from "@api/modules/feature-name/controllers/feature-name.controller";
import { FeatureNameService } from "@api/modules/feature-name/services/feature-name.service";

@Module({
  controllers: [FeatureNameController],
  providers: [FeatureNameService],
  exports: [FeatureNameService],
})
export class FeatureNameModule {}
```

**`controllers/feature-name.controller.ts`:**

```typescript
import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "@api/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@api/modules/auth/guards/roles.guard";
import { Roles } from "@api/modules/auth/decorators/roles.decorator";
import { UserRole } from "@repo/validation";
import { FeatureNameService } from "@api/modules/feature-name/services/feature-name.service";
import { CreateFeatureDto } from "@api/modules/feature-name/dto/create-feature.dto";

@ApiTags("feature-name")
@Controller({ path: "feature-name", version: "1" })
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class FeatureNameController {
  constructor(private readonly featureService: FeatureNameService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Create new feature" })
  async create(@Body() dto: CreateFeatureDto) {
    return this.featureService.create(dto);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get feature by ID" })
  async findOne(@Param("id") id: string) {
    return this.featureService.findOne(id);
  }
}
```

**`services/feature-name.service.ts`:**

```typescript
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@app/common/database/prisma.service";
import { CreateFeatureDto } from "@api/modules/feature-name/dto/create-feature.dto";

@Injectable()
export class FeatureNameService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFeatureDto) {
    return this.prisma.feature.create({
      data: dto,
    });
  }

  async findOne(id: string) {
    const feature = await this.prisma.feature.findUnique({
      where: { id },
    });

    if (!feature) {
      throw new NotFoundException(`Feature with ID ${id} not found`);
    }

    return feature;
  }
}
```

**`dto/create-feature.dto.ts`:**

```typescript
import { IsString, IsOptional, IsEnum } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UserRole } from "@repo/validation";

export class CreateFeatureDto {
  @ApiProperty({ description: "Feature name" })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: "Feature description" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: UserRole, description: "Required role" })
  @IsEnum(UserRole)
  requiredRole: UserRole;
}
```

### 3. Register in Root Module

**`apps/api/src/api.module.ts`:**

```typescript
import { FeatureNameModule } from "@api/modules/feature-name/feature-name.module";

@Module({
  imports: [
    // ... other imports
    FeatureNameModule,
  ],
})
export class ApiModule {}
```

---

## Authentication & Authorization

### JWT Guards

Use `JwtAuthGuard` for protected routes:

```typescript
@UseGuards(JwtAuthGuard)
@Get('protected')
async protectedRoute() {
  return { message: 'This requires authentication' };
}
```

### Role-Based Access

Use `RolesGuard` with `@Roles` decorator:

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.PLATFORM_ADMIN)
@Delete(':id')
async deleteResource(@Param('id') id: string) {
  // Only admins can access this
}
```

### Get Current User

Use `@CurrentUser` decorator:

```typescript
import { CurrentUser } from '@api/modules/auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@app/common/types/auth.types';

@Get('profile')
async getProfile(@CurrentUser() user: AuthenticatedUser) {
  return user; // { id, email, role, sessionId, ... }
}
```

---

## Email Templates (React Email)

### Creating Email Templates

**`apps/api/src/modules/email/templates/welcome.tsx`:**

```typescript
import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Img,
} from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
  loginUrl: string;
}

export function WelcomeEmail({ name, loginUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={section}>
            <Text style={title}>Welcome, {name}!</Text>
            <Text style={text}>
              Thank you for joining us. We're excited to have you on board.
            </Text>
            <Button style={button} href={loginUrl}>
              Get Started
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const section = {
  padding: '24px',
};

const title = {
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
};

const text = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#525f7f',
};

const button = {
  backgroundColor: '#5469d4',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px',
};

export default WelcomeEmail;
```

### Sending Emails

**`email.service.ts`:**

```typescript
import { Injectable } from "@nestjs/common";
import { render } from "@react-email/components";
import * as nodemailer from "nodemailer";
import { WelcomeEmail } from "@api/modules/email/templates/welcome";

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendWelcomeEmail(to: string, name: string) {
    const html = await render(
      WelcomeEmail({
        name,
        loginUrl: `${process.env.FRONTEND_URL}/auth/login`,
      }),
    );

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: "Welcome to Our App!",
      html,
    });
  }
}
```

---

## Database (Prisma)

### Schema Best Practices

**`prisma/schema.prisma`:**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Use enums for fixed sets of values
enum UserRole {
  PLATFORM_ADMIN  // Internal platform administrators
  ADMIN           // Organization/company admins
  USER            // Regular users
}

model User {
  id       String   @id @default(cuid())
  email    String   @unique
  password String?
  name     String?
  role     UserRole @default(USER)

  // OAuth fields
  provider   String?
  providerId String?
  image      String?

  // Verification & Status
  emailVerified Boolean @default(false)
  phoneVerified Boolean @default(false)
  isActive      Boolean @default(true)

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  sessions           Session[]
  verificationTokens VerificationToken[]

  @@index([email])
  @@map("users")
}
```

### Migrations

```bash
# Create migration
pnpm prisma migrate dev --name add_feature

# Generate client
pnpm prisma generate

# Seed database
pnpm prisma:seed
```

---

## Best Practices

### 1. Error Handling

```typescript
import {
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
} from "@nestjs/common";

// Not found
throw new NotFoundException("Resource not found");

// Validation error
throw new BadRequestException("Invalid input data");

// Auth errors
throw new UnauthorizedException("Invalid credentials");
throw new ForbiddenException("Insufficient permissions");

// Conflict (e.g., duplicate email)
throw new ConflictException("Email already exists");
```

### 2. Swagger Documentation

```typescript
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";

@ApiTags("users")
@Controller("users")
export class UsersController {
  @Post()
  @ApiOperation({ summary: "Create a new user" })
  @ApiResponse({ status: 201, description: "User created successfully" })
  @ApiResponse({ status: 400, description: "Invalid input" })
  @ApiResponse({ status: 409, description: "Email already exists" })
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all users (admin only)" })
  @Roles(UserRole.ADMIN)
  async findAll() {
    return this.usersService.findAll();
  }
}
```

### 3. Environment Variables

Use `ConfigService` from `@nestjs/config`:

```typescript
import { ConfigService } from '@nestjs/config';

constructor(private readonly config: ConfigService) {}

const apiUrl = this.config.get<string>('API_URL');
const port = this.config.get<number>('PORT', 3000); // with default
```

### 4. Testing Commands

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:cov

# Type check
pnpm typecheck

# Lint
pnpm lint
```

---

## Common Pitfalls to Avoid

❌ Using relative imports  
❌ String literals instead of enums  
❌ Missing Swagger documentation  
❌ Not validating DTOs  
❌ Bare `new PrismaClient()` in scripts  
❌ Forgetting to register modules in `api.module.ts`  
❌ Not using `@UseGuards` on protected routes  
❌ Mixing absolute and relative imports

---

## Quick Reference

### Useful Commands

```bash
# Generate module/controller/service
nest g module modules/feature-name
nest g controller modules/feature-name/controllers/feature-name --flat
nest g service modules/feature-name/services/feature-name --flat

# Database
pnpm prisma migrate dev
pnpm prisma generate
pnpm prisma studio  # GUI for database
pnpm prisma:seed

# Development
pnpm dev            # Start both apps
pnpm dev:api        # Backend only
pnpm typecheck      # Type check all packages
pnpm build          # Build for production
```

### Common Decorators

```typescript
// HTTP Methods
@Get(), @Post(), @Put(), @Patch(), @Delete()

// Parameters
@Param('id'), @Query(), @Body(), @Headers()

// Auth
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@CurrentUser()

// Swagger
@ApiTags(), @ApiOperation(), @ApiResponse()
@ApiBearerAuth(), @ApiProperty()

// Validation
@IsString(), @IsEmail(), @IsEnum(), @IsOptional()
@MinLength(), @MaxLength(), @Min(), @Max()
```

---

**Remember**: This template is designed for rapid development with strong type safety and best practices. Always follow the patterns established in the `auth` and `example` modules when creating new features.

// Refunds
RefundStatus; // PENDING | PROCESSING | COMPLETED | FAILED

// Subscriptions
SubscriptionStatus; // ACTIVE | PAUSED | CANCELLED | EXPIRED | PAST_DUE | TRIALING | PENDING
SubscriptionInterval; // DAILY | WEEKLY | MONTHLY | YEARLY

// Bulk Payouts
BulkPayoutStatus; // PENDING | APPROVED | PROCESSING | COMPLETED | FAILED | CANCELLED

// Invoices
InvoiceStatus; // DRAFT | SENT | PAID | CANCELLED | OVERDUE

````

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
````

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
