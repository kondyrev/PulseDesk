import { notFound } from "next/navigation";

import { TicketMessagesPanel } from "@/components/dashboard/tickets/ticket-messages-panel";
import { TicketReplyForm } from "@/components/dashboard/tickets/ticket-reply-form";
import { createClient } from "@/lib/supabase/server";
import { TicketAiPanel } from "@/components/dashboard/tickets/ticket-ai-panel";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TicketDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("profile_id", user.id)
    .single();

  if (!membership) {
    return null;
  }

  const workspaceId = membership.workspace_id;

  const { data: ticket } = await supabase
    .from("tickets")
    .select("*")
    .eq("id", id)
    .eq("workspace_id", workspaceId)
    .single();

  if (!ticket) {
    notFound();
  }

  const { data: messages } = await supabase
    .from("ticket_messages")
    .select("id, sender_type, content, page_url, created_at")
    .eq("ticket_id", ticket.id)
    .order("created_at", { ascending: true });

  return (
    <div className="grid h-full min-h-0 grid-cols-[minmax(0,1fr)_360px] overflow-hidden">
      <div className="grid min-h-0 min-w-0 grid-rows-[auto_minmax(0,1fr)_auto] border-r border-black/5 bg-[#f6f7f8]">
        <div className="border-b border-black/5 bg-white px-8 py-6">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">
              {ticket.status === "new" ? "Новое" : ticket.status}
            </span>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
              {ticket.priority === "normal"
                ? "Обычный приоритет"
                : ticket.priority}
            </span>

            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
              {ticket.source === "widget" ? "Виджет" : ticket.source}
            </span>
          </div>

          <h1 className="max-w-4xl text-3xl font-black tracking-tight">
            {ticket.title}
          </h1>

          <p className="mt-3 text-sm text-zinc-500">
            {ticket.customer_name || "Без имени"} ·{" "}
            {ticket.customer_email || "email не указан"}
          </p>
        </div>

        <TicketMessagesPanel
          ticketId={ticket.id}
          initialMessages={messages || []}
        />

        <div className="border-t border-black/5 bg-white p-6">
          <TicketReplyForm ticketId={ticket.id} />
        </div>
      </div>

      <aside className="h-full overflow-y-auto bg-white p-6">
        <TicketAiPanel ticketId={ticket.id} />
      </aside>
    </div>
  );
}