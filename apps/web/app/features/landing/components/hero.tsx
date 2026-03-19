import { Button } from "@repo/ui/components";
import { Link } from "react-router";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      {/* Background gradients */}
      <div
        aria-hidden="true"
        className="absolute -top-96 start-1/2 flex -translate-x-1/2 transform -z-10"
      >
        <div className="bg-gradient-to-r from-background/50 to-background blur-3xl w-[25rem] h-[44rem] rotate-[-60deg] transform -translate-x-[10rem] dark:from-primary/20 dark:to-purple-500/20" />
        <div className="bg-gradient-to-tl from-primary/30 via-primary/10 to-background blur-3xl w-[90rem] h-[50rem] rounded-full origin-top-left -rotate-12 -translate-x-[15rem] dark:from-indigo-500/10" />
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium backdrop-blur-sm mb-6 bg-background/50">
          <span className="flex size-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-muted-foreground">
            Production-Ready Monorepo Template
          </span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl max-w-4xl text-balance bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          Build Scalable Apps with{" "}
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            NestJS & React
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-muted-foreground text-balance">
          A modern, production-ready monorepo starter with authentication,
          role-based access, email templates, and best practices built-in. Start
          building features, not boilerplate.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/auth/signup">
            <Button size="lg" className="h-12 px-8 text-base">
              Get Started Free
            </Button>
          </Link>
          <a
            href="https://github.com/yourusername/nest-react-template"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="lg" className="h-12 px-8 text-base">
              View on GitHub
            </Button>
          </a>
        </div>

        {/* Code Preview */}
        <div className="mt-20 relative w-full max-w-5xl">
          <div className="relative rounded-xl border bg-background/50 shadow-2xl backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />

            {/* Terminal Header */}
            <div className="relative flex items-center justify-between px-4 h-12 border-b bg-muted/20 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-red-500/30" />
                <div className="size-3 rounded-full bg-yellow-500/30" />
                <div className="size-3 rounded-full bg-green-500/30" />
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                terminal
              </span>
              <div className="w-20" />
            </div>

            {/* Code Content */}
            <div className="relative p-6 font-mono text-sm">
              <div className="space-y-2 text-left">
                <div className="flex gap-2">
                  <span className="text-muted-foreground">$</span>
                  <span className="text-foreground">
                    git clone nest-react-template
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground">$</span>
                  <span className="text-foreground">pnpm install</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground">$</span>
                  <span className="text-foreground">pnpm dev</span>
                </div>
                <div className="mt-4 text-green-500">
                  ✓ Ready! Backend: http://localhost:3000 | Frontend:
                  http://localhost:5173
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -z-10 -bottom-10 -right-10 size-64 bg-primary/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute -z-10 -top-10 -left-10 size-64 bg-indigo-500/20 rounded-full blur-3xl opacity-50" />
      </div>
    </section>
  );
}
