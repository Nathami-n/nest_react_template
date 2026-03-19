# Frontend Development Guide (React + React Router)

## Tech Stack

- **Framework**: React 19 (via React Router v7)
- **Routing**: React Router v7 (file-based)
- **Styling**: TailwindCSS 3
- **UI Components**: Shadcn UI (`@repo/ui/components`)
- **State Management**: TanStack Query (React Query) v5
- **Form Handling**: React Hook Form + `@repo/form-engine`
- **Validation**: Zod via `@repo/validation`
- **Icons**: Lucide React (via Shadcn)
- **Notifications**: Sonner (toast notifications)

---

## Critical Rules

### 1. **ALWAYS Use Absolute Imports**

❌ **NEVER** use relative imports:

```typescript
import { Button } from "../../components/ui/button"; // WRONG
import { useAuth } from "../hooks/use-auth"; // WRONG
```

✅ **ALWAYS** use absolute imports with `@/` prefix:

```typescript
import { Button } from "@repo/ui/components";
import { useAuth } from "@/context/auth-context";
import { loginUser } from "@/features/auth/api/login";
import { UserRole } from "@repo/validation";
```

**Path Aliases Available:**

- `@/` → `apps/web/app/*`
- `@repo/*` → `packages/*`

### 2. **Enum Usage - The Most Important Rule**

**NEVER use string literals where enums exist. ALWAYS use the enum member.**

All enums are imported from `@repo/validation`.

✅ **Correct:**

```typescript
import { UserRole } from '@repo/validation';

// In conditionals
if (user.role === UserRole.ADMIN) { ... }

// In components
{user.role === UserRole.PLATFORM_ADMIN && <AdminPanel />}

// In API calls
body: { role: UserRole.USER }

// In type guards
const isAdmin = (role: UserRole) => role === UserRole.ADMIN;
```

❌ **Wrong:**

```typescript
if (user.role === 'ADMIN') { ... }     // String literal - NEVER!
{user.role === 'PLATFORM_ADMIN' && ...} // String literal
body: { role: 'USER' }                  // String literal
```

### 3. **Component Structure**

Keep components focused and modular:

```typescript
// Feature components (business logic)
features/
  auth/
    components/     # Feature-specific UI
    api/           # Raw API calls
    queries/       # React Query hooks
    mutations/     # React Query mutations

// Shared UI (no business logic)
@repo/ui/components/  # Reusable primitives
```

---

## Directory Structure (`apps/web`)

```
apps/web/
├── app/
│   ├── features/              # Feature modules
│   │   ├── auth/
│   │   │   ├── api/          # API client functions
│   │   │   │   ├── login.ts
│   │   │   │   └── signup.ts
│   │   │   ├── queries/      # useQuery hooks
│   │   │   │   └── use-current-user.ts
│   │   │   ├── mutations/    # useMutation hooks
│   │   │   │   ├── use-login.ts
│   │   │   │   └── use-signup.ts
│   │   │   ├── components/   # Feature UI
│   │   │   │   ├── login-form.tsx
│   │   │   │   └── signup-form.tsx
│   │   │   └── index.ts      # Public exports
│   │   ├── dashboard/
│   │   │   ├── api/
│   │   │   ├── queries/
│   │   │   ├── components/
│   │   │   │   ├── admin-dashboard.tsx
│   │   │   │   ├── user-dashboard.tsx
│   │   │   │   └── dashboard-registry.tsx
│   │   │   └── index.ts
│   │   └── landing/
│   │       └── components/
│   ├── routes/               # File-based routing
│   │   ├── home.tsx         # Landing page
│   │   ├── auth/
│   │   │   ├── login.tsx
│   │   │   └── signup.tsx
│   │   └── dashboard/
│   │       └── index.tsx
│   ├── layouts/              # Layout components
│   │   ├── dashboard-layout.tsx
│   │   └── auth-layout.tsx
│   ├── lib/                  # Utilities
│   │   ├── api-client.ts    # HTTP client
│   │   └── query-keys.ts    # Query key factory
│   ├── context/              # React contexts
│   │   └── auth-context.tsx
│   ├── middleware/           # Route middleware
│   │   └── auth.ts
│   ├── env/                  # Environment variables
│   │   ├── env.client.ts
│   │   └── env.server.ts
│   ├── utils/                # Helper functions
│   ├── root.tsx              # Root layout
│   └── routes.ts             # Route config
├── public/                   # Static assets
└── package.json
```

---

## Feature-Based Architecture

### Creating a New Feature

**1. Create Feature Directory:**

```
app/features/my-feature/
├── api/
│   ├── get-items.ts
│   └── create-item.ts
├── queries/
│   └── use-items.ts
├── mutations/
│   └── use-create-item.ts
├── components/
│   ├── item-list.tsx
│   └── create-item-form.tsx
└── index.ts
```

**2. API Layer (`api/get-items.ts`):**

```typescript
import { apiClient } from "@/lib/api-client";

export interface Item {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
}

export async function getItems(): Promise<Item[]> {
  const response = await apiClient.get<Item[]>("/items");
  return response.data;
}
```

**3. Query Hook (`queries/use-items.ts`):**

```typescript
import { useQuery } from "@tanstack/react-query";
import { getItems } from "@/features/my-feature/api/get-items";
import { queryKeys } from "@/lib/query-keys";

export function useItems() {
  return useQuery({
    queryKey: queryKeys.items.all,
    queryFn: getItems,
  });
}
```

**4. Mutation Hook (`mutations/use-create-item.ts`):**

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "sonner";

interface CreateItemInput {
  name: string;
}

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateItemInput) => {
      const response = await apiClient.post("/items", input);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.items.all });
      toast.success("Item created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create item");
    },
  });
}
```

**5. Component (`components/item-list.tsx`):**

```typescript
import { useItems } from '@/features/my-feature/queries/use-items';
import { Card } from '@repo/ui/components';

export function ItemList() {
  const { data: items, isLoading, error } = useItems();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid gap-4">
      {items?.map((item) => (
        <Card key={item.id} className="p-4">
          <h3 className="font-semibold">{item.name}</h3>
        </Card>
      ))}
    </div>
  );
}
```

**6. Feature Index (`index.ts`):**

```typescript
// Components
export * from "./components/item-list";
export * from "./components/create-item-form";

// Hooks
export * from "./queries/use-items";
export * from "./mutations/use-create-item";

// Types (if needed)
export type * from "./api/get-items";
```

---

## Forms with React Hook Form

### Using Form Engine

**With `@repo/form-engine`:**

```typescript
import { useFormEngine, type FormConfig } from '@repo/form-engine';
import { loginSchema, type LoginInput } from '@repo/validation';
import {
  Button,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  Input,
} from '@repo/ui/components';

export function LoginForm({ onSubmit }: { onSubmit: (data: LoginInput) => void }) {
  const formConfig: FormConfig<LoginInput> = {
    fields: [
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'you@example.com',
        autoComplete: 'email',
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: '••••••••',
        autoComplete: 'current-password',
      },
    ],
    schema: loginSchema,
    defaultValues: {
      email: '',
      password: '',
    },
  };

  const { form, fields } = useFormEngine(formConfig);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {fields.map((field) => (
        <FormField
          key={field.name}
          control={form.control as any}
          name={field.name as keyof LoginInput}
        >
          <FormLabel>{field.label}</FormLabel>
          <FormControl>
            {({ field: fieldProps }) => (
              <Input
                {...fieldProps}
                type={field.type}
                placeholder={field.placeholder}
                autoComplete={field.autoComplete}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormField>
      ))}

      <Button type="submit" className="w-full">
        Sign In
      </Button>
    </form>
  );
}
```

**Key Points:**

- Cast `control` as `any` to avoid type issues
- Cast `field.name` to `keyof YourInputType`
- Use render function in `FormControl`: `{({ field }) => <Input {...field} />}`

---

## Routing (React Router v7)

### File-Based Routes

Routes are defined by file structure in `app/routes/`:

```
routes/
├── home.tsx              # /
├── auth/
│   ├── login.tsx        # /auth/login
│   └── signup.tsx       # /auth/signup
└── dashboard/
    └── index.tsx        # /dashboard
```

### Route Component

```typescript
import type { Route } from './+types/login';
import { LoginForm } from '@/features/auth/components/login-form';
import { useLogin } from '@/features/auth/mutations/use-login';

export default function LoginRoute() {
  const login = useLogin();

  const handleSubmit = async (data: LoginInput) => {
    await login.mutateAsync(data);
  };

  return (
    <div className="container">
      <LoginForm
        onSubmit={handleSubmit}
        isLoading={login.isPending}
        error={login.error?.message}
      />
    </div>
  );
}
```

### Protected Routes with Loader

```typescript
import { redirect } from 'react-router';
import type { Route } from './+types/dashboard';
import { getUserSessionFromServer } from '@repo/utils';
import { VITE_API_URL } from '@/env/env.client';

export async function clientLoader() {
  const { data: user, success } = await getUserSessionFromServer(VITE_API_URL);

  if (!success || !user) {
    throw redirect('/auth/login');
  }

  return { user };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1>Welcome, {loaderData.user.name}!</h1>
    </div>
  );
}
```

---

## Role-Based Dashboard Pattern

### Dashboard Registry

```typescript
import { UserRole } from "@repo/validation";
import { AdminDashboard } from "@/features/dashboard/components/admin-dashboard";
import { UserDashboard } from "@/features/dashboard/components/user-dashboard";
import { PlatformAdminDashboard } from "@/features/dashboard/components/platform-admin-dashboard";

const DASHBOARD_REGISTRY = {
  [UserRole.PLATFORM_ADMIN]: PlatformAdminDashboard,
  [UserRole.ADMIN]: AdminDashboard,
  [UserRole.USER]: UserDashboard,
};

export function getDashboardComponent(role: UserRole) {
  return DASHBOARD_REGISTRY[role] || UserDashboard;
}
```

### Using the Registry

```typescript
import { getDashboardComponent } from '@/features/dashboard/components/dashboard-registry';

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const DashboardComponent = getDashboardComponent(loaderData.user.role);
  return <DashboardComponent user={loaderData.user} />;
}
```

---

## API Client Setup

### Base Client (`lib/api-client.ts`)

```typescript
import axios from "axios";
import { VITE_API_URL } from "@/env/env.client";

export const apiClient = axios.create({
  baseURL: `${VITE_API_URL}/api/v1`,
  withCredentials: true, // Send cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add any custom headers here
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message;
    return Promise.reject(new Error(message));
  },
);
```

### Query Keys (`lib/query-keys.ts`)

```typescript
export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  items: {
    all: ["items"] as const,
    detail: (id: string) => ["items", id] as const,
  },
  dashboard: {
    stats: ["dashboard", "stats"] as const,
  },
} as const;
```

---

## Styling with TailwindCSS

### Component Styling Best Practices

```typescript
import { cn } from '@repo/ui/lib/utils';

export function MyComponent({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4",
        "rounded-lg border bg-card",
        "hover:bg-accent transition-colors",
        className // Allow override
      )}
    >
      <h2 className="text-2xl font-bold">Title</h2>
      <p className="text-muted-foreground">Description</p>
    </div>
  );
}
```

### Common Patterns

```typescript
// Card
<div className="rounded-xl border bg-card p-6 shadow-sm">

// Button variants
<Button variant="default">Primary</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Tertiary</Button>
<Button variant="destructive">Delete</Button>

// Layout
<div className="container max-w-7xl mx-auto px-4">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Spacing
<div className="space-y-4"> // Vertical spacing
<div className="space-x-2"> // Horizontal spacing
<div className="flex gap-4"> // Gap utility

// Typography
<h1 className="text-4xl font-bold tracking-tight">
<p className="text-lg text-muted-foreground">
<span className="text-sm text-destructive">
```

---

## Best Practices

### 1. Error Handling

```typescript
import { toast } from 'sonner';

// In mutations
const mutation = useMutation({
  mutationFn: createItem,
  onSuccess: () => {
    toast.success('Item created!');
  },
  onError: (error) => {
    toast.error(error.message || 'Something went wrong');
  },
});

// In components
if (error) {
  return (
    <div className="rounded-md bg-destructive/10 p-4 text-destructive">
      {error.message}
    </div>
  );
}
```

### 2. Loading States

```typescript
// Skeleton loading
import { Skeleton } from '@repo/ui/components';

if (isLoading) {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}

// Spinner loading
if (isLoading) {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  );
}
```

### 3. Type Safety

```typescript
// Always type your props
interface MyComponentProps {
  title: string;
  count: number;
  onAction: (id: string) => void;
  className?: string;
}

export function MyComponent({
  title,
  count,
  onAction,
  className,
}: MyComponentProps) {
  // Component logic
}

// Use type imports for types
import type { User } from "@repo/validation";
```

### 4. Performance

```typescript
// Memoize expensive calculations
import { useMemo } from "react";

const sortedItems = useMemo(
  () => items.sort((a, b) => a.name.localeCompare(b.name)),
  [items],
);

// Memoize callbacks
import { useCallback } from "react";

const handleClick = useCallback((id: string) => {
  // Handle click
}, []);
```

---

## Common Pitfalls to Avoid

❌ Using relative imports  
❌ String literals instead of enums  
❌ Fetching data in components (use queries)  
❌ Not handling loading/error states  
❌ Inline styles (use Tailwind)  
❌ Creating duplicate UI components (use `@repo/ui`)  
❌ Forgetting `withCredentials: true` in API calls  
❌ Not invalidating queries after mutations

---

## Quick Reference

### Useful Commands

```bash
# Development
pnpm dev              # Start both apps
pnpm dev:web          # Frontend only
pnpm build            # Build for production
pnpm typecheck        # Type check
pnpm lint             # Lint code
```

### Common Imports

```typescript
// UI Components
import { Button, Input, Card, Dialog } from "@repo/ui/components";

// Icons
import { Check, X, ChevronRight } from "lucide-react";

// Validation & Types
import { UserRole } from "@repo/validation";
import type { User, LoginInput } from "@repo/validation";

// TanStack Query
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Routing
import { Link, useNavigate, redirect } from "react-router";
import type { Route } from "./+types/my-route";

// Toast
import { toast } from "sonner";

// Utils
import { cn } from "@repo/ui/lib/utils";
```

---

**Remember**: This template prioritizes type safety, developer experience, and maintainability. Always follow the feature-based architecture and keep components focused on a single responsibility.

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
