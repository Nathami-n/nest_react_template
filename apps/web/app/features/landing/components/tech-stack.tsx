const techStack = {
  Backend: [
    { name: "NestJS 11", description: "Enterprise-grade Node.js framework" },
    { name: "Prisma", description: "Next-gen ORM with PostgreSQL" },
    { name: "JWT Auth", description: "Secure token-based authentication" },
    { name: "React Email", description: "Type-safe email templates" },
    { name: "BullMQ", description: "Background job processing" },
    { name: "Swagger", description: "Auto-generated API docs" },
  ],
  Frontend: [
    { name: "React 19", description: "Latest React with concurrent features" },
    { name: "React Router 7", description: "File-based routing with loaders" },
    { name: "TanStack Query", description: "Powerful data fetching & caching" },
    { name: "Shadcn UI", description: "Beautiful, accessible components" },
    { name: "TailwindCSS", description: "Utility-first styling" },
    { name: "React Hook Form", description: "Performant form management" },
  ],
  DevOps: [
    { name: "pnpm Workspaces", description: "Fast, disk-efficient monorepo" },
    { name: "Turborepo", description: "High-performance build system" },
    { name: "Docker", description: "Containerized development & deployment" },
    { name: "TypeScript 5", description: "End-to-end type safety" },
    { name: "ESLint", description: "Code quality & consistency" },
    { name: "Prettier", description: "Opinionated code formatting" },
  ],
};

export function TechStack() {
  return (
    <section id="tech-stack" className="py-24">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Built with modern technologies
          </h2>
          <p className="text-lg text-muted-foreground">
            Carefully selected, battle-tested tools that work seamlessly
            together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(techStack).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary"></span>
                {category}
              </h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.name}
                    className="group p-4 rounded-lg border bg-background hover:bg-muted/50 transition-colors"
                  >
                    <div className="font-medium mb-1">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
