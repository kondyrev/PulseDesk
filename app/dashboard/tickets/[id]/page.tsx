import { notFound } from "next/navigation";

import { TicketAiPanel } from "@/components/dashboard/tickets/ticket-ai-panel";
import { TicketMessagesPanel } from "@/components/dashboard/tickets/ticket-messages-panel";
import { TicketReplyForm } from "@/components/dashboard/tickets/ticket-reply-form";
import { TicketToolbar } from "@/components/dashboard/tickets/ticket-toolbar";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getStatusLabel(status: string) {
  if (status === "new") return "Новое";
  if (status === "closed") return "Закрыто";
  if (status === "waiting_operator") return "Ждёт оператора";
  if (status === "waiting_customer") return "Ждёт клиента";
  if (status === "resolved") return "Решено";
  if (status === "open") return "В работе";

  return status;
}

function getPriorityLabel(priority: string) {
  if (priority === "urgent") return "Срочный";
  if (priority === "high") return "Высокий";
  if (priority === "low") return "Низкий";

  return "Обычный";
}

function getPriorityClass(priority: string) {
  if (priority === "urgent") return "bg-red-50 text-red-700 ring-red-100";
  if (priority === "high") return "bg-amber-50 text-amber-700 ring-amber-100";
  if (priority === "low") return "bg-zinc-100 text-zinc-600 ring-zinc-200";

  return "bg-blue-50 text-blue-600 ring-blue-100";
}

export default async function TicketDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const membership = await prisma.workspaceMember.findFirst({
    where: {
      userId: user.id,
    },
    select: {
      workspaceId: true,
    },
  });

  if (!membership?.workspaceId) {
    return null;
  }

  const ticket = await prisma.ticket.findFirst({
    where: {
      id,
      workspaceId: membership.workspaceId,
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
    <div className="grid h-full min-h-0 grid-cols-[minmax(0,1fr)_380px] overflow-hidden">
      <div className="grid min-h-0 min-w-0 grid-rows-[auto_minmax(0,1fr)_auto] border-r border-black/5 bg-[#f6f7f8]">
        <div className="border-b border-black/5 bg-white px-8 py-6">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600 ring-1 ring-zinc-200">
                  {getStatusLabel(ticket.status)}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getPriorityClass(
                    ticket.priority
                  )}`}
                >
                  {getPriorityLabel(ticket.priority)}
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

            <TicketToolbar
              ticketId={ticket.id}
              status={ticket.status}
              priority={ticket.priority}
            />
          </div>
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
        <TicketAiPanel ticketId={ticket.id} isClosed={isClosed} />
      </aside>
    </div>
  );
}