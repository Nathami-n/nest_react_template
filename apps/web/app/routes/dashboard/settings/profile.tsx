import { PageHeader, Button, Input, FormLabel } from "@repo/ui/components";

export default function ProfileSettingsPage({ loaderData }: any) {
  const { user } = loaderData?.user || loaderData;

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="Profile"
        titleClassName="text-2xl"
        description="Manage your personal information and preferences."
      />

      <div className="rounded-lg border bg-card p-6">
        <form className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <FormLabel htmlFor="name">Full Name</FormLabel>
              <Input
                id="name"
                type="text"
                defaultValue={user?.name || ""}
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                type="email"
                defaultValue={user?.email || ""}
                placeholder="your@email.com"
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <FormLabel htmlFor="phone">Phone Number</FormLabel>
            <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
          </div>

          <Button type="submit">Save Changes</Button>
        </form>
      </div>
    </div>
  );
}
