import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let unreadTicketsCount = 0;

  if (user) {
    const { data: membership } = await supabase
      .from("workspace_members")
      .select("workspace_id")
      .eq("profile_id", user.id)
      .single();

    if (membership?.workspace_id) {
      unreadTicketsCount = await prisma.ticket.count({
        where: {
          workspaceId: membership.workspace_id,
          status: "waiting_operator",
        },
      });
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f7f8]">
      <DashboardSidebar unreadTicketsCount={unreadTicketsCount} />

      <main className="min-h-0 min-w-0 flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}