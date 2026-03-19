# NestJS API

Production-ready NestJS API with authentication, Prisma ORM, and comprehensive example module.

## Features

- ✅ Complete authentication system (email/password + Google OAuth)
- ✅ JWT with HTTP-only cookies
- ✅ Email verification with OTP
- ✅ Password reset flow
- ✅ Prisma ORM with PostgreSQL
- ✅ Swagger API documentation
- ✅ Example CRUD module
- ✅ Docker support

## Quick Start

\`\`\`bash

# Install dependencies

pnpm install

# Start services (PostgreSQL + MailHog)

docker-compose up -d

# Copy environment

cp .env.example .env

# Run migrations

pnpm prisma migrate dev
pnpm prisma:seed

# Start development

pnpm dev
\`\`\`

API runs on http://localhost:3000  
Docs available at http://localhost:3000/api/docs

## Scripts

- `pnpm dev` - Start in watch mode
- `pnpm build` - Build for production
- `pnpm start:prod` - Start production server
- `pnpm lint` - Lint code
- `pnpm test` - Run tests
- `pnpm prisma:studio` - Open Prisma Studio
- `pnpm prisma:migrate` - Run database migrations

## Environment Variables

See [.env.example](.env.example) for all configuration options.

## Documentation

- [Quick Start Guide](../../docs/QUICKSTART.md)
- [API Reference](../../docs/API.md)
- [Architecture](../../docs/ARCHITECTURE.md)

## Adding New Modules

See the `example` module for a complete reference implementation showing:

- Controller with CRUD endpoints
- Service with business logic
- DTOs for validation
- Protected routes with JWT guards
- Swagger documentation

## License

MIT
