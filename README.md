# NestJS + React Monorepo Template

A production-ready, fully-type safe monorepo template featuring NestJS backend with authentication and React Router frontend. Perfect for quickly scaffolding new full-stack projects.

## Features

### Backend (NestJS)

- **Complete Authentication System**
  - Email/password authentication with bcrypt
  - Google OAuth integration
  - JWT access & refresh tokens (HTTP-only cookies)
  - Email verification with OTP
  - Password reset flow
  - Session management with token rotation
  - Role-based access control (RBAC)

- **Clean Architecture**
  - Modular structure by feature
  - Shared common library (`@app/common`)
  - Service-repository pattern
  - Global exception handling
  - Response wrapper interceptor
  - Zod validation with class-validator

- **Example Module**
  - Demonstrates CRUD operations
  - Protected routes with JWT guards
  - Swagger API documentation
  - Best practices for new features

- **Infrastructure**
  - PostgreSQL with Prisma ORM
  - Docker Compose setup
  - MailHog for email testing
  - Winston logging
  - API versioning

### Frontend (React)

- React Router v7
- TanStack Query (React Query)
- Tailwind CSS + shadcn/ui
- TypeScript
- Zod validation

### Shared Packages

- `@repo/validation` - Shared Zod schemas & types
- `@repo/ui` - Component library
- `@repo/utils` - Shared utilities
- `@repo/api` - API client
- `@repo/form-engine` - Form management
- `@repo/typescript-config` - Shared TS configs
- `@repo/eslint-config` - Shared linting rules

## Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL (or use Docker Compose)
- Docker (optional, for containerized services)

## Quick Start

### 1. Clone & Install

\`\`\`bash
git clone <your-repo>
cd nest-react-template-monorepo
pnpm install
\`\`\`

### 2. Setup Database

**Option A: Using Docker Compose (Recommended)**

\`\`\`bash
cd apps/api
docker-compose up -d
\`\`\`

This starts:

- PostgreSQL on port 5432
- MailHog Web UI on http://localhost:8025

**Option B: Local PostgreSQL**

\`\`\`bash
createdb template_db
\`\`\`

### 3. Configure Environment

\`\`\`bash
cd apps/api
cp .env.example .env
\`\`\`

Update `DATABASE_URL` and other settings in `.env` as needed.

### 4. Run Migrations

\`\`\`bash
cd apps/api
pnpm prisma migrate dev
pnpm prisma generate
\`\`\`

### 5. Seed Database (Optional)

\`\`\`bash
pnpm prisma:seed
\`\`\`

Creates test users:

- Admin: `admin@example.com` / `admin123`
- User: `user@example.com` / `user123`

### 6. Start Development

From the root directory:

\`\`\`bash
pnpm dev
\`\`\`

This starts:

- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173
- **API Docs**: http://localhost:3000/api/docs

## Documentation

- [Quick Start Guide](docs/QUICKSTART.md)
- [API Documentation](docs/API.md)
- [Architecture Overview](docs/ARCHITECTURE.md)

## Project Structure

\`\`\`
monorepo/
├── apps/
│ ├── api/ # NestJS backend
│ │ ├── apps/api/src/
│ │ │ ├── modules/
│ │ │ │ ├── auth/ # Authentication module
│ │ │ │ ├── example/ # Example CRUD module
│ │ │ │ └── email/ # Email service
│ │ │ ├── main.ts
│ │ │ └── api.module.ts
│ │ ├── libs/common/ # Shared library
│ │ ├── prisma/
│ │ │ ├── schema.prisma
│ │ │ └── migrations/
│ │ ├── package.json
│ │ ├── docker-compose.yml
│ │ └── .env.example
│ └── web/ # React frontend
├── packages/ # Shared packages
│ ├── api/
│ ├── ui/
│ ├── validation/
│ ├── utils/
│ ├── form-engine/
│ ├── typescript-config/
│ └── eslint-config/
├── docs/
├── package.json
├── turbo.json
└── pnpm-workspace.yaml
\`\`\`

## Authentication Endpoints

| Method | Endpoint                       | Description               |
| ------ | ------------------------------ | ------------------------- |
| POST   | `/api/v1/auth/signup`          | Register new user         |
| POST   | `/api/v1/auth/login`           | Login with email/password |
| GET    | `/api/v1/auth/refresh`         | Refresh access token      |
| POST   | `/api/v1/auth/logout`          | Logout and revoke session |
| GET    | `/api/v1/auth/me`              | Get current user          |
| POST   | `/api/v1/auth/verify-email`    | Verify email with OTP     |
| POST   | `/api/v1/auth/resend-otp`      | Resend verification OTP   |
| POST   | `/api/v1/auth/forgot-password` | Request password reset    |
| POST   | `/api/v1/auth/reset-password`  | Reset password with token |
| GET    | `/api/v1/auth/google`          | Initiate Google OAuth     |
| GET    | `/api/v1/auth/google/callback` | Google OAuth callback     |

## Adding New Features

The `example` module demonstrates best practices for adding new features:

\`\`\`typescript
apps/api/apps/api/src/modules/example/
├── example.module.ts # Module definition
├── controllers/
│ └── example.controller.ts # API endpoints
├── services/
│ └── example.service.ts # Business logic
└── dto/
└── example.dto.ts # Data validation
\`\`\`

### Steps to Add a New Feature:

1. **Create Module Structure**
   \`\`\`bash
   mkdir -p apps/api/apps/api/src/modules/your-feature/{controllers,services,dto}
   \`\`\`

2. **Define Prisma Model** (if needed)
   \`\`\`prisma
   model YourFeature {
   id String @id @default(cuid())
   userId String
   user User @relation(fields: [userId], references: [id])
   // ... your fields
   }
   \`\`\`

3. **Create Service** - Business logic
4. **Create DTOs** - Input/output validation
5. **Create Controller** - API endpoints
6. **Register Module** in `api.module.ts`

## Testing

### Unit Tests

\`\`\`bash
pnpm test
\`\`\`

### E2E Tests

\`\`\`bash
pnpm test:e2e
\`\`\`

### Test Coverage

\`\`\`bash
pnpm test:cov
\`\`\`

## Docker Deployment

### Build Production Image

\`\`\`bash
cd apps/api
docker build -t your-api:latest .
\`\`\`

### Run with Docker Compose

\`\`\`bash
docker-compose up -d
\`\`\`

## Environment Variables

See [`.env.example`](apps/api/.env.example) for all configuration options.

### Required

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for signing JWTs
- `JWT_REFRESH_SECRET` - Secret for refresh tokens

### Optional

- `GOOGLE_CLIENT_ID` - For Google OAuth
- `GOOGLE_CLIENT_SECRET` - For Google OAuth
- `EMAIL_HOST` - SMTP server
- `EMAIL_PORT` - SMTP port

## Scripts

### Root Level

- `pnpm dev` - Start all apps in dev mode
- `pnpm build` - Build all apps
- `pnpm lint` - Lint all packages
- `pnpm typecheck` - Type check all packages

### API Specific

- `pnpm --filter @repo/api dev` - Start API only
- `pnpm --filter @repo/api prisma:studio` - Open Prisma Studio
- `pnpm --filter @repo/api prisma:migrate` - Run migrations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT

## Tips

- Check MailHog UI at http://localhost:8025 for development emails
- Use Prisma Studio for database browsing: `pnpm prisma:studio`
- API documentation available at http://localhost:3000/api/docs
- All API responses are wrapped in a standard format
- Sessions use HTTP-only cookies for security

---

**Built with NestJS, React, and TypeScript**
