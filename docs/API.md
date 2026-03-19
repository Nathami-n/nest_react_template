# API Documentation

Complete API reference for the NestJS backend.

## Base URL

- Development: `http://localhost:3000/api/v1`
- Production: `https://your-domain.com/api/v1`

## Authentication

The API uses JWT tokens stored in HTTP-only cookies for authentication.

### Cookie Names

- `access_token` - Short-lived JWT (1 hour)
- `refresh_token` - Long-lived token (7 days)

### Headers

Protected endpoints require valid cookies. The browser handles this automatically.

For API clients (Postman, curl):
\`\`\`bash
curl -X GET http://localhost:3000/api/v1/auth/me \\
-b "access_token=YOUR_TOKEN"
\`\`\`

## Response Format

All responses follow this structure:

**Success Response:**
\`\`\`json
{
"data": { /_ your data _/ },
"message": "Success message",
"timestamp": "2026-03-16T10:30:00.000Z"
}
\`\`\`

**Error Response:**
\`\`\`json
{
"statusCode": 400,
"message": "Error message",
"error": "Bad Request",
"timestamp": "2026-03-16T10:30:00.000Z"
}
\`\`\`

## Endpoints

### Health Check

#### GET /

Check API health status.

**Response:**
\`\`\`json
{
"status": "ok",
"timestamp": "2026-03-16T10:30:00.000Z",
"uptime": 12345.67
}
\`\`\`

---

## Authentication Endpoints

### POST /auth/signup

Register a new user.

**Request Body:**
\`\`\`json
{
"email": "user@example.com",
"password": "password123",
"name": "John Doe"
}
\`\`\`

**Response:**
\`\`\`json
{
"id": "clx123...",
"email": "user@example.com",
"name": "John Doe",
"role": "USER",
"emailVerified": false,
"createdAt": "2026-03-16T10:30:00.000Z"
}
\`\`\`

**Errors:**

- `409` - Email already exists

---

### POST /auth/login

Login with email and password.

**Request Body:**
\`\`\`json
{
"email": "user@example.com",
"password": "password123"
}
\`\`\`

**Response:**
\`\`\`json
{
"message": "Logged in successfully"
}
\`\`\`

Sets `access_token` and `refresh_token` cookies.

**Errors:**

- `401` - Invalid credentials
- `401` - Account locked (too many failed attempts)

---

### GET /auth/refresh

Refresh access token using refresh token cookie.

**Response:**
\`\`\`json
{
"message": "Tokens refreshed"
}
\`\`\`

Updates both cookies with new tokens.

**Errors:**

- `401` - Invalid or expired refresh token

---

### POST /auth/logout

Logout and revoke session.

**Response:**
\`\`\`json
{
"message": "Logged out successfully"
}
\`\`\`

Clears authentication cookies.

---

### GET /auth/me

Get current user information.

**Authentication:** Required

**Response:**
\`\`\`json
{
"id": "clx123...",
"email": "user@example.com",
"name": "John Doe",
"image": "https://...",
"role": "USER",
"emailVerified": true,
"sessionId": "session123..."
}
\`\`\`

**Errors:**

- `401` - Not authenticated
- `401` - Session revoked

---

### POST /auth/verify-email

Verify email with OTP code.

**Request Body:**
\`\`\`json
{
"email": "user@example.com",
"otp": "123456"
}
\`\`\`

**Response:**
\`\`\`json
{
"message": "Email verified successfully"
}
\`\`\`

**Errors:**

- `400` - Invalid or expired OTP
- `400` - User not found

---

### POST /auth/resend-otp

Resend verification OTP.

**Request Body:**
\`\`\`json
{
"email": "user@example.com"
}
\`\`\`

**Response:**
\`\`\`json
{
"message": "Verification code sent to your email"
}
\`\`\`

**Errors:**

- `400` - Email not found
- `400` - Email already verified

---

### POST /auth/forgot-password

Request password reset email.

**Request Body:**
\`\`\`json
{
"email": "user@example.com"
}
\`\`\`

**Response:**
\`\`\`json
{
"message": "If an account with that email exists, a password reset link has been sent."
}
\`\`\`

Always returns 200 to prevent email enumeration.

---

### POST /auth/reset-password

Reset password with token.

**Request Body:**
\`\`\`json
{
"token": "reset-token-from-email",
"password": "newPassword123"
}
\`\`\`

**Response:**
\`\`\`json
{
"message": "Password reset successfully. Please log in with your new password."
}
\`\`\`

**Errors:**

- `400` - Invalid or expired token

---

### GET /auth/google

Initiate Google OAuth flow.

Redirects to Google login page.

---

### GET /auth/google/callback

Google OAuth callback (internal use).

After successful Google login, redirects to:
\`\`\`
{FRONTEND_URL}/auth/success
\`\`\`

---

## Example Endpoints

Demonstrates CRUD operations with authentication.

### GET /examples

Get all examples.

**Authentication:** Required

**Response:**
\`\`\`json
[
{
"id": "1",
"title": "Example 1",
"description": "Description",
"createdAt": "2026-03-16T10:30:00.000Z"
}
]
\`\`\`

---

### GET /examples/:id

Get a single example.

**Authentication:** Required

**Parameters:**

- `id` - Example ID

**Response:**
\`\`\`json
{
"id": "1",
"title": "Example Item",
"description": "This is an example",
"createdAt": "2026-03-16T10:30:00.000Z"
}
\`\`\`

**Errors:**

- `404` - Example not found

---

### POST /examples

Create a new example.

**Authentication:** Required

**Request Body:**
\`\`\`json
{
"title": "My Example",
"description": "Optional description"
}
\`\`\`

**Response:**
\`\`\`json
{
"id": "new-id",
"title": "My Example",
"description": "Optional description",
"userId": "user-id",
"createdAt": "2026-03-16T10:30:00.000Z"
}
\`\`\`

---

### PUT /examples/:id

Update an existing example.

**Authentication:** Required

**Parameters:**

- `id` - Example ID

**Request Body:**
\`\`\`json
{
"title": "Updated Title",
"description": "Updated description"
}
\`\`\`

**Response:**
\`\`\`json
{
"id": "id",
"title": "Updated Title",
"description": "Updated description",
"userId": "user-id",
"updatedAt": "2026-03-16T10:30:00.000Z"
}
\`\`\`

**Errors:**

- `404` - Example not found
- `403` - Not authorized (not your example)

---

### DELETE /examples/:id

Delete an example.

**Authentication:** Required

**Parameters:**

- `id` - Example ID

**Response:**
\`\`\`json
{
"message": "Example deleted successfully"
}
\`\`\`

**Errors:**

- `404` - Example not found
- `403` - Not authorized (not your example)

---

## Rate Limiting

Certain endpoints have rate limits to prevent abuse:

| Endpoint                   | Limit      |
| -------------------------- | ---------- |
| POST /auth/signup          | 5 req/min  |
| POST /auth/login           | 10 req/min |
| POST /auth/verify-email    | 10 req/min |
| POST /auth/resend-otp      | 5 req/min  |
| POST /auth/forgot-password | 3 req/min  |
| POST /auth/reset-password  | 5 req/min  |

**Response when rate limited:**
\`\`\`json
{
"statusCode": 429,
"message": "Too Many Requests",
"error": "ThrottlerException"
}
\`\`\`

---

## OpenAPI/Swagger Documentation

Interactive API documentation is available at:

**URL:** http://localhost:3000/api/docs

Features:

- Try API calls directly from the browser
- See request/response schemas
- Test authentication flows
- Export OpenAPI spec

---

## Error Codes

| Code | Meaning                                             |
| ---- | --------------------------------------------------- |
| 200  | Success                                             |
| 201  | Created                                             |
| 400  | Bad Request - Invalid input                         |
| 401  | Unauthorized - Not logged in or invalid credentials |
| 403  | Forbidden - Insufficient permissions                |
| 404  | Not Found - Resource doesn't exist                  |
| 409  | Conflict - Duplicate resource                       |
| 429  | Too Many Requests - Rate limit exceeded             |
| 500  | Internal Server Error                               |

---

## Testing with cURL

### Complete Authentication Flow

\`\`\`bash

# 1. Sign up

curl -X POST http://localhost:3000/api/v1/auth/signup \\
-H "Content-Type: application/json" \\
-d '{"email":"test@example.com","password":"password123","name":"Test User"}' \\
-c cookies.txt

# 2. Login

curl -X POST http://localhost:3000/api/v1/auth/login \\
-H "Content-Type: application/json" \\
-d '{"email":"test@example.com","password":"password123"}' \\
-c cookies.txt

# 3. Get current user

curl http://localhost:3000/api/v1/auth/me \\
-b cookies.txt

# 4. Create example

curl -X POST http://localhost:3000/api/v1/examples \\
-H "Content-Type: application/json" \\
-b cookies.txt \\
-d '{"title":"My Example","description":"Testing"}'

# 5. Logout

curl -X POST http://localhost:3000/api/v1/auth/logout \\
-b cookies.txt \\
-c cookies.txt
\`\`\`

---

## WebSocket Support

Currently not implemented. Can be added using NestJS WebSocket gateway.

---

**For more examples, see the [Quick Start Guide](QUICKSTART.md)**
