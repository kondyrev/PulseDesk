import { redirect } from "next/navigation";

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  let unreadTicketsCount = 0;

  const membership = await prisma.workspaceMember.findFirst({
    where: {
      userId: user.id,
    },
    select: {
      workspaceId: true,
    },
  });

  if (membership?.workspaceId) {
    unreadTicketsCount = await prisma.ticket.count({
      where: {
        workspaceId: membership.workspaceId,
        status: "waiting_operator",
      },
    });
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