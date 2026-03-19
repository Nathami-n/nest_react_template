import { Logo } from "@repo/ui/components";
import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="max-w-7xl mx-auto py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 flex flex-col items-start">
            <div className="mb-4">
              <Logo showText text="NestReact" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A production-ready monorepo starter for building scalable web
              applications with NestJS and React.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/docs" className="hover:text-foreground">
                  Documentation
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/yourusername/nest-react-template"
                  className="hover:text-foreground"
                >
                  GitHub
                </a>
              </li>
              <li>
                <Link to="#features" className="hover:text-foreground">
                  Features
                </Link>
              </li>
              <li>
                <Link to="#tech-stack" className="hover:text-foreground">
                  Tech Stack
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/privacy" className="hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} NestReact Template. Open source under MIT
          license.
        </div>
      </div>
    </footer>
  );
}
