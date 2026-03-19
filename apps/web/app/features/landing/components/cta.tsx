import { Button } from "@repo/ui/components";
import { Link } from "react-router";

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl mb-6">
            Start building today
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Clone the repo, run three commands, and have a production-ready app
            running in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/auth/signup">
              <Button size="lg" className="h-12 px-8 text-base">
                Create Free Account
              </Button>
            </Link>
            <a
              href="https://github.com/yourusername/nest-react-template"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base"
              >
                Star on GitHub
              </Button>
            </a>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Free forever • No credit card required • Open source MIT license
          </p>
        </div>
      </div>
    </section>
  );
}
