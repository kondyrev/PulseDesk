import { DashboardSidebar } from "./dashboard-sidebar";
import { Topbar } from "./topbar";

export function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="flex">
        <DashboardSidebar />

        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar />

          <main className="flex-1 p-6 lg:p-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}