import { PageHeader, Button } from "@repo/ui/components";

export default function SecuritySettingsPage({ loaderData }: any) {
  const { user } = loaderData?.user || loaderData;

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="Security"
        titleClassName="text-2xl"
        description="Manage your password and security preferences."
      />

      <div className="rounded-lg border bg-card p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Verified</p>
              <p className="text-sm text-muted-foreground">
                Your email is{" "}
                {user?.emailVerified ? "verified" : "not verified"}
              </p>
            </div>
            {user?.emailVerified ? (
              <div className="flex items-center gap-2 text-green-600">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Verified
              </div>
            ) : (
              <Button variant="outline" size="sm">
                Verify Email
              </Button>
            )}
          </div>

          <div className="border-t pt-4">
            <p className="mb-2 font-medium">Change Password</p>
            <p className="mb-4 text-sm text-muted-foreground">
              Update your password to keep your account secure
            </p>
            <Button variant="outline">Change Password</Button>
          </div>

          <div className="border-t pt-4">
            <p className="mb-2 font-medium">Two-Factor Authentication</p>
            <p className="mb-4 text-sm text-muted-foreground">
              Add an extra layer of security to your account
            </p>
            <Button variant="outline">Enable 2FA</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
