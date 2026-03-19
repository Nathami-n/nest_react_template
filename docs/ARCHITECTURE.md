# Architecture Overview

Understanding the structure and design decisions of this monorepo template.

## Technology Stack

### Backend

- **NestJS** - Enterprise Node.js framework
- **Prisma** - Type-safe ORM
- **PostgreSQL** - Primary database
- **Passport.js** - Authentication
- **JWT** - Token-based auth
- **Zod** - Schema validation
- **Winston** - Logging

### Frontend

- **React 19** - UI library
- **React Router v7** - Routing
- **TanStack Query** - Data fetching
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Zod** - Form validation

### Monorepo Tools

- **Turborepo** - Build orchestration
- **pnpm** - Package manager with workspaces

---

## Monorepo Structure

\`\`\`
monorepo/
├── apps/ # Applications
│ ├── api/ # NestJS backend
│ └── web/ # React frontend
├── packages/ # Shared packages
│ ├── api/ # API client
│ ├── ui/ # Component library
│ ├── validation/ # Shared schemas
│ ├── utils/ # Utilities
│ ├── form-engine/ # Form management
│ ├── typescript-config/
│ └── eslint-config/
├── docs/ # Documentation
├── turbo.json # Turborepo config
├── pnpm-workspace.yaml
└── package.json
\`\`\`

### Why Monorepo?

- **Shared Code** - Reuse types, validation, components
- **Atomic Changes** - Update API and frontend together
- **Consistency** - Single lint/test/build config
- **Developer Experience** - One repo to clone

---

## Backend Architecture

### Modular Design

Each feature is self-contained module:

\`\`\`
modules/
├── auth/ # Authentication
│ ├── controllers/ # HTTP endpoints
│ ├── services/ # Business logic
│ ├── strategies/ # Passport strategies
│ ├── guards/ # Authorization
│ ├── dto/ # Validation
│ └── decorators/ # Custom decorators
├── example/ # Feature module
│ ├── controllers/
│ ├── services/
│ └── dto/
└── email/ # Email service
└── services/
\`\`\`

### Shared Common Library

\`\`\`
libs/common/
├── config/ # Configuration service
├── database/ # Prisma service
├── events/ # Domain events
├── queue/ # Job queue (optional)
├── filters/ # Exception filters
├── interceptors/ # Response wrapper
├── pipes/ # Validation pipes
├── types/ # Shared types
├── constants/ # Constants
└── utils/ # Utilities
\`\`\`

Imported as `@app/common` across all modules.

---

## Authentication Flow

### Registration

1. User submits email/password
2. Password hashed with bcrypt
3. User created in database
4. OTP generated and emailed
5. User verifies email with OTP
6. Account activated

### Login Flow

\`\`\`
Client API Database
| | |
|-- POST /login --->| |
| |-- validate user --->|
| |<-- user data -------|
| | |
| |-- create session -->|
| |<-- session ---------|
| | |
| |-- generate JWT ---| |
|<-- Set Cookies ---| | |
| (access+refresh) | | |
\`\`\`

### Token Strategy

- **Access Token** (1 hour)
  - Stored in HTTP-only cookie
  - Contains: userId, email, role, sessionId
  - Used for API requests

- **Refresh Token** (7 days)
  - Stored in HTTP-only cookie
  - Stored in database (allows revocation)
  - Used to get new access token

### Session Management

- Each login creates a new session
- Tokens rotated on refresh
- Sessions can be revoked
- Old sessions cleaned up automatically

---

## Database Design

### Core Models

\`\`\`prisma
User
├── id (Primary Key)
├── email (Unique)
├── password (Hashed)
├── name
├── role (USER | ADMIN)
├── provider (local | google)
├── emailVerified
└── timestamps

Session
├── id (Primary Key)
├── userId (Foreign Key)
├── refreshToken (Unique)
├── expiresAt
├── isRevoked
└── createdAt

VerificationToken
├── id (Primary Key)
├── userId (Foreign Key)
├── token (Unique)
├── type (email_verification | password_reset)
├── expiresAt
└── createdAt
\`\`\`

### Indexes

Strategic indexes for performance:

- User: `email`
- Session: `userId`, `refreshToken`
- VerificationToken: `userId`, `token`

---

## Security Best Practices

### Implemented

- **Password Hashing** - bcrypt with salt
- **HTTP-Only Cookies** - XSS protection
- **JWT Signature** - Tamper-proof tokens
- **Token Rotation** - Refresh token rotation
- **Session Revocation** - Logout invalidates tokens
- **Rate Limiting** - Prevent brute force
- **CORS** - Whitelist origins
- **Helmet** - Security headers
- **Input Validation** - class-validator + Zod

### Production Checklist

- [ ] Change JWT secrets
- [ ] Use HTTPS
- [ ] Enable secure cookies
- [ ] Set strong CORS policy
- [ ] Configure rate limits
- [ ] Set up monitoring
- [ ] Enable database backups
- [ ] Use environment secrets manager

---

## API Design Principles

### RESTful Conventions

- **GET** - Retrieve resources
- **POST** - Create resources
- **PUT/PATCH** - Update resources
- **DELETE** - Remove resources

### Versioning

All endpoints prefixed with version:
\`\`\`
/api/v1/auth/login
/api/v1/examples
\`\`\`

### Response Wrapper

Consistent structure for all endpoints:

**Success:**
\`\`\`json
{
"data": { /_ payload _/ },
"message": "Success",
"timestamp": "..."
}
\`\`\`

**Error:**
\`\`\`json
{
"statusCode": 400,
"message": "Error description",
"error": "Bad Request",
"timestamp": "..."
}
\`\`\`

---

## State Management

### Frontend

- **TanStack Query** - Server state
- **React Context** - Auth state
- **URL State** - Search params, pagination

### Why TanStack Query?

- Automatic caching
- Background refetching
- Optimistic updates
- Type-safe with TypeScript
- DevTools included

---

## File Organization

### Backend Module Structure

\`\`\`
feature/
├── feature.module.ts # Module definition
├── index.ts # Barrel export
├── controllers/
│ ├── feature.controller.ts
│ └── index.ts
├── services/
│ ├── feature.service.ts
│ └── index.ts
├── dto/
│ ├── create-feature.dto.ts
│ ├── update-feature.dto.ts
│ └── index.ts
├── guards/ # Optional
├── decorators/ # Optional
└── types/ # Optional
\`\`\`

### Import Aliases

- `@app/common` - Common library
- `@api/*` - API source files
- `@repo/*` - Shared packages

---

## Development Workflow

### Adding a New Feature

1. **Define Prisma Model** (if needed)
   \`\`\`prisma
   model Feature {
   id String @id @default(cuid())
   userId String
   user User @relation(...)
   // fields
   }
   \`\`\`

2. **Run Migration**
   \`\`\`bash
   pnpm prisma migrate dev --name add_feature
   \`\`\`

3. **Create Module Structure**
   \`\`\`bash
   mkdir -p apps/api/apps/api/src/modules/feature/{controllers,services,dto}
   \`\`\`

4. **Implement Service** (business logic)
5. **Create DTOs** (validation)
6. **Build Controller** (endpoints)
7. **Register in AppModule**

### Testing Strategy

- **Unit Tests** - Services & utilities
- **Integration Tests** - Controllers
- **E2E Tests** - Full flows

---

## Deployment

### Docker

Multi-stage build optimizes image size:

\`\`\`dockerfile

1. Prune workspace
2. Install dependencies
3. Build app
4. Create slim runtime image
   \`\`\`

### Environment Variables

- Development: `.env` file
- Production: Secrets manager (AWS Secrets, etc.)

### Database Migrations

Automatic on deployment:
\`\`\`bash
npx prisma migrate deploy
\`\`\`

---

## Performance Considerations

### Database

- Connection pooling (default in Prisma)
- Strategic indexes on foreign keys
- Pagination for large datasets

### Caching (Future)

Can add Redis for:

- Session storage
- Rate limiting
- Response caching

### Background Jobs (Optional)

BullMQ ready to add for:

- Email queues
- Scheduled tasks
- Long-running operations

---

## Extensibility Points

### Adding OAuth Providers

1. Install passport strategy
2. Create strategy class
3. Add to auth module
4. Configure environment

### Adding Features

Use the `example` module as template - it demonstrates:

- CRUD operations
- Authentication
- Input validation
- Error handling

### WebSockets

Can add with `@nestjs/websockets`:
\`\`\`typescript
@WebSocketGateway()
export class EventsGateway { ... }
\`\`\`

---

## Key Design Decisions

### Why HTTP-Only Cookies?

✅ XSS protection (JS can't access)  
✅ Automatic browser handling  
✅ CSRF protection with SameSite

**vs localStorage:** Vulnerable to XSS

### Why Prisma?

✅ Type safety  
✅ Migrations  
✅ Modern API  
✅ Multi-database support

**vs TypeORM:** Better DX, active development

### Why Monorepo?

✅ Shared code reuse  
✅ Atomic commits  
✅ Unified tooling

**vs Polyrepo:** Simpler for small teams

---

**For implementation details, see source code and JSDoc comments.**
