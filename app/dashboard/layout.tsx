import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#f6f7f8]">
      <DashboardSidebar />

      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}