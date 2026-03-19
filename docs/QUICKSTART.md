# Quick Start Guide

Get your NestJS + React monorepo running in less than 5 minutes!

## Prerequisites Check

Before starting, ensure you have:

- Node.js 18+ (`node --version`)
- pnpm installed (`npm install -g pnpm`)
- Docker (optional, for easy database setup)

## Step-by-Step Setup

### 1. Install Dependencies (1 min)

\`\`\`bash
pnpm install
\`\`\`

### 2. Start Database Services (1 min)

\`\`\`bash
cd apps/api
docker-compose up -d
\`\`\`

This starts:

- PostgreSQL on `localhost:5432`
- MailHog UI on http://localhost:8025

### 3. Configure Environment (30 sec)

\`\`\`bash
cd apps/api
cp .env.example .env
\`\`\`

The defaults work out of the box!

### 4. Setup Database (1 min)

\`\`\`bash

# Still in apps/api directory

pnpm prisma migrate dev
pnpm prisma:seed # Optional: creates test users
\`\`\`

### 5. Start Development Servers (30 sec)

Return to root directory:

\`\`\`bash
cd ../..
pnpm dev
\`\`\`

## You're Ready!

Your applications are now running:

- **API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api/docs
- **Frontend**: http://localhost:5173
- **MailHog**: http://localhost:8025

## Test the Authentication

### 1. Try the API Endpoints

Open http://localhost:3000/api/docs to see all available endpoints.

**Sign Up:**
\`\`\`bash
curl -X POST http://localhost:3000/api/v1/auth/signup \\
-H "Content-Type: application/json" \\
-d '{
"email": "test@example.com",
"password": "password123",
"name": "Test User"
}'
\`\`\`

**Login with Test User:**
\`\`\`bash
curl -X POST http://localhost:3000/api/v1/auth/login \\
-H "Content-Type: application/json" \\
-d '{
"email": "user@example.com",
"password": "user123"
}' \\
-c cookies.txt # Save cookies
\`\`\`

**Get Current User:**
\`\`\`bash
curl http://localhost:3000/api/v1/auth/me \\
-b cookies.txt # Use saved cookies
\`\`\`

### 2. Check Email in MailHog

When you sign up or reset password:

1. Open http://localhost:8025
2. See the verification emails
3. Copy OTP codes

### 3. Test Example Module

\`\`\`bash

# Get all examples (requires authentication)

curl http://localhost:3000/api/v1/examples \\
-b cookies.txt

# Create an example

curl -X POST http://localhost:3000/api/v1/examples \\
-H "Content-Type: application/json" \\
-b cookies.txt \\
-d '{"title": "My First Example", "description": "Testing the API"}'
\`\`\`

## Next Steps

### Explore the Codebase

1. **Auth Module**: [apps/api/apps/api/src/modules/auth](../apps/api/apps/api/src/modules/auth)
   - See how authentication is implemented
   - JWT strategy, Guards, Decorators

2. **Example Module**: [apps/api/apps/api/src/modules/example](../apps/api/apps/api/src/modules/example)
   - Template for adding new features
   - Shows CRUD operations
   - Uses guards for protection

3. **Common Library**: [apps/api/libs/common](../apps/api/libs/common)
   - Shared utilities
   - Prisma service
   - Config service
   - Logger

### Try Google OAuth (Optional)

1. Get OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/)
2. Add to `.env`:
   \`\`\`env
   GOOGLE_CLIENT_ID="your-client-id"
   GOOGLE_CLIENT_SECRET="your-secret"
   GOOGLE_CALLBACK_URL="http://localhost:3000/api/v1/auth/google/callback"
   \`\`\`
3. Restart the API
4. Visit http://localhost:3000/api/v1/auth/google

### Browse the Database

\`\`\`bash
cd apps/api
pnpm prisma:studio
\`\`\`

Opens Prisma Studio at http://localhost:5555

## Troubleshooting

**Database connection failed?**

- Ensure Docker is running: `docker ps`
- Check DATABASE_URL in `.env`

**Port already in use?**

- Backend: Change `PORT` in `.env`
- Frontend: Modify `vite.config.ts`

**Prisma errors?**

- Regenerate client: `pnpm prisma generate`
- Reset database: `pnpm prisma migrate reset`

**Can't see emails?**

- Check MailHog is running: http://localhost:8025
- Verify EMAIL_HOST and EMAIL_PORT in `.env`

## Ready to Build!

You now have:

- Full authentication system
- Example CRUD module
- Email service
- Database with Prisma
- Type-safe frontend
- API documentation

Start building your features! See [README.md](../README.md) for architecture details.

---

**Need help?** Check the [API Documentation](API.md) or open an issue.
