const features = [
  {
    title: "Auth Out of the Box",
    description:
      "Complete authentication system with JWT, refresh tokens, email verification, and password reset flows.",
  },
  {
    title: "Role-Based Access",
    description:
      "Platform Admin, Admin, and User roles with granular permissions and route protection.",
  },
  {
    title: "Email Templates",
    description:
      "Beautiful, responsive React Email templates for verification, welcome, and password reset emails.",
  },
  {
    title: "Modern UI Components",
    description:
      "Shadcn UI components with TailwindCSS, dark mode support, and full TypeScript coverage.",
  },
  {
    title: "Type-Safe APIs",
    description:
      "End-to-end type safety from database to frontend with Prisma, Zod validation, and shared types.",
  },
  {
    title: "Dashboard System",
    description:
      "Pre-built role-specific dashboards with charts, analytics, and customizable layouts.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-muted/50 overflow-hidden">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Everything you need to ship fast
          </h2>
          <p className="text-lg text-muted-foreground">
            Stop wasting time on boilerplate. Focus on building your unique
            features with battle-tested patterns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border bg-background p-8 hover:shadow-lg transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="w-8 h-1 rounded-full bg-primary mb-5" />

              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
