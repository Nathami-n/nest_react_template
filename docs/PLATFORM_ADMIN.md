# Platform Admin Setup

## Role Structure

The system now has three distinct user roles:

1. **PLATFORM_ADMIN** - Internal platform administrators
   - Can see all users on the system
   - No email verification required
   - Seeded directly in the database
   - Full system access

2. **ADMIN** - Organization/company admins
   - Manages their organization
   - Regular admin privileges
   - Requires email verification

3. **USER** - Regular users
   - Standard user access
   - Requires email verification

## Setup Instructions

### 1. Run the migration

```bash
cd apps/api
npx prisma migrate dev --name add-platform-admin-role
```

### 2. Seed the database

```bash
cd apps/api
npx prisma db seed
```

This will create:

- **Platform Admin**: platform@admin.com / platformadmin123
- **Admin User**: admin@example.com / admin123
- **Test User**: user@example.com / user123

### 3. Access the platform

Log in with the platform admin credentials to see the full user management interface at `/dashboard/admin/users`.

## API Endpoints

### Get All Users (Platform Admin Only)

```
GET /users
Authorization: Bearer <jwt_token>
```

### Get Single User (Platform Admin Only)

```
GET /users/:id
Authorization: Bearer <jwt_token>
```

### Update User Status (Platform Admin Only)

```
PATCH /users/:id/status
Authorization: Bearer <jwt_token>
Body: { "isActive": true/false }
```

## Navigation

The dashboard navigation adapts based on user role:

- **PLATFORM_ADMIN**: Shows "Platform Management" section with "All Users" link
- **ADMIN/USER**: Shows standard navigation without platform management

## Security

- All platform admin endpoints are protected by the `@Roles('PLATFORM_ADMIN')` decorator
- The RolesGuard ensures only users with PLATFORM_ADMIN role can access these endpoints
- Platform admins bypass email verification requirements
