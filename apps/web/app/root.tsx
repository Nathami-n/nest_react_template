import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
} from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./lib/query-client";

import type { Route } from "./+types/root";
import "@repo/ui/globals.css";
import { Toaster, Button } from "@repo/ui/components";
import { constructMetadata } from "./utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon, Home01Icon, ArrowLeft02Icon } from "@hugeicons/core-free-icons";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "icon",
    type: "image/svg+xml",
    href: "/favicon.svg"
  }
];

export const meta: Route.MetaFunction = () => constructMetadata({
  title: "Pay and get paid with ease",
  description: "Secure, fast, and reliable payment solution for your business. Accept payments via M-Pesa, Card, and Bank Transfer.",
});

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors expand />
      <Outlet />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background text-center px-4 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 flex items-center justify-center -z-10">
          <div className="text-[15rem] md:text-[20rem] font-black text-muted/20 select-none">404</div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 blur-[100px] rounded-full -z-10" />

        <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary mb-6 shadow-sm ring-1 ring-primary/20">
          <HugeiconsIcon icon={Alert02Icon} className="size-10" />
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 text-balance">
          Page not found
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mb-8 text-balance">
          Sorry, we couldn't find the page you're looking for. It might have been removed, renamed, or doesn't exist.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="h-12 px-8">
            <Link to="/">
              <HugeiconsIcon icon={Home01Icon} className="mr-2 size-5" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="h-12 px-8 cursor-pointer" onClick={() => window.history.back()}>
            <HugeiconsIcon icon={ArrowLeft02Icon} className="mr-2 size-5" />
            Go Back
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
