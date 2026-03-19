import { Button, Logo } from "@repo/ui/components";
import { Link } from "react-router";

export function Navbar({ userLoggedIn }: { userLoggedIn?: boolean }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex h-16 items-center">
        {/* Left: logo */}
        <div className="flex-1 flex items-center">
          <Link to="/">
            <Logo size="sm" showText text="NestReact" direction="horizontal" />
          </Link>
        </div>

        {/* Center: nav links — absolutely centered relative to the full bar */}
        <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          <Link
            to="#features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            to="#tech-stack"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Tech Stack
          </Link>
          <Link
            to="/docs"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Docs
          </Link>
        </nav>

        {/* Right: auth buttons */}
        <div className="flex-1 flex items-center justify-end gap-3">
          {userLoggedIn ? (
            <Link to="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/auth/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
