import { Button } from "@repo/ui/components";
import { Link } from "react-router";

export function Navbar({ userLoggedIn }: { userLoggedIn?: boolean }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">N</span>
            </div>
            <span className="text-xl font-bold">NestReact</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
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
        </div>

        <div className="flex items-center gap-3">
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
