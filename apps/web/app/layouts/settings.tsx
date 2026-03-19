import { TabsSidebar } from "@/features/settings";
import { Outlet } from "react-router";
import { PageHeader } from "@repo/ui/components";

export default function SettingsLayout() {
  return (
    <div className="space-y-6">
      <div>
        <PageHeader
          title="Settings"
          description="Manage your account settings"
        />
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-62.5 lg:w-70 shrink-0">
          <TabsSidebar />
        </aside>
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
