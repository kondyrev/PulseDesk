import { notFound } from "next/navigation";

import { CloseTicketButton } from "@/components/dashboard/tickets/close-ticket-button";
import { TicketMessagesPanel } from "@/components/dashboard/tickets/ticket-messages-panel";
import { TicketReplyForm } from "@/components/dashboard/tickets/ticket-reply-form";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

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

  if (!membership?.workspace_id) {
    return null;
  }

  const ticket = await prisma.ticket.findFirst({
    where: {
      id,
      workspaceId: membership.workspace_id,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!ticket) {
    notFound();
  }

  await prisma.user.upsert({
    where: {
      id: user.id,
    },
    update: {
      email: user.email || "",
    },
    create: {
      id: user.id,
      email: user.email || "",
      passwordHash: "supabase-auth",
    },
  });

  await prisma.ticketReadState.upsert({
    where: {
      ticketId_userId: {
        ticketId: ticket.id,
        userId: user.id,
      },
    },
    update: {
      lastReadAt: new Date(),
    },
    create: {
      ticketId: ticket.id,
      userId: user.id,
      lastReadAt: new Date(),
    },
  });

  const isClosed = ticket.status === "closed";

  const initialMessages = ticket.messages.map((message) => ({
    id: message.id,
    sender_type: message.senderType,
    content: message.content,
    page_url: message.pageUrl,
    created_at: message.createdAt.toISOString(),
  }));

  return (
    <div className="grid h-full min-h-0 grid-cols-[minmax(0,1fr)_360px] overflow-hidden">
      <div className="grid min-h-0 min-w-0 grid-rows-[auto_minmax(0,1fr)_auto] border-r border-black/5 bg-[#f6f7f8]">
        <div className="border-b border-black/5 bg-white px-8 py-6">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">
              {ticket.status === "new"
                ? "Новое"
                : ticket.status === "closed"
                  ? "Закрыто"
                  : ticket.status === "waiting_operator"
                    ? "Ждёт оператора"
                    : ticket.status === "waiting_customer"
                      ? "Ждёт клиента"
                      : ticket.status}
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
            {ticket.customerName || "Без имени"} ·{" "}
            {ticket.customerEmail || "email не указан"}
          </p>
        </div>

        <TicketMessagesPanel
          ticketId={ticket.id}
          initialMessages={initialMessages}
        />

        <div className="border-t border-black/5 bg-white p-6">
          <TicketReplyForm ticketId={ticket.id} isClosed={isClosed} />
        </div>
      </div>

      <aside className="h-full overflow-y-auto bg-white p-6">
        <div className="sticky top-6 space-y-6">
          <div className="rounded-[32px] border border-black/5 p-6">
            <div className="mb-3 text-sm font-semibold text-zinc-400">
              Состояние обращения
            </div>

            {isClosed ? (
              <>
                <div className="text-base font-semibold text-emerald-700">
                  ✓ Обращение закрыто
                </div>

                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  Новые сообщения и ответы недоступны.
                </p>
              </>
            ) : (
              <>
                <div className="text-base font-semibold text-orange-700">
                  Обращение в работе
                </div>

                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  Клиент и оператор могут продолжать переписку.
                </p>

                <div className="mt-5">
                  <CloseTicketButton ticketId={ticket.id} isClosed={isClosed} />
                </div>
              </>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}