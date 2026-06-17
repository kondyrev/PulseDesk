import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { ArrowUpRight, Inbox } from "lucide-react";

import { TicketsAutoRefresh } from "@/components/dashboard/tickets/tickets-auto-refresh";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type TicketStatus =
  | "new"
  | "open"
  | "waiting_operator"
  | "waiting_customer"
  | "resolved"
  | "closed";

const statusView: Record<
  TicketStatus,
  {
    label: string;
    dot: string;
    badge: string;
  }
> = {
  new: {
    label: "Новое",
    dot: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700 ring-blue-100",
  },
  open: {
    label: "В работе",
    dot: "bg-violet-500",
    badge: "bg-violet-50 text-violet-700 ring-violet-100",
  },
  waiting_operator: {
    label: "Ждёт оператора",
    dot: "bg-red-500",
    badge: "bg-red-50 text-red-700 ring-red-100",
  },
  waiting_customer: {
    label: "Ждёт клиента",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 ring-amber-100",
  },
  resolved: {
    label: "Решено",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  closed: {
    label: "Закрыто",
    dot: "bg-zinc-400",
    badge: "bg-zinc-100 text-zinc-600 ring-zinc-200",
  },
};

function getStatusView(status: string) {
  return statusView[status as TicketStatus] || statusView.open;
}

export default async function TicketsPage() {
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
    .limit(1)
    .single();

  const workspaceId = membership?.workspace_id;

  const tickets = workspaceId
    ? await prisma.ticket.findMany({
        where: {
          workspaceId,
        },
        include: {
          readStates: {
            where: {
              userId: user.id,
            },
            take: 1,
          },
          messages: {
            orderBy: {
              createdAt: "desc",
            },
            take: 20,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    : [];

  const sortedTickets = [...tickets].sort((a, b) => {
    const aLast = a.messages[0]?.createdAt || a.createdAt;
    const bLast = b.messages[0]?.createdAt || b.createdAt;

    return bLast.getTime() - aLast.getTime();
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f7f8]">
      <TicketsAutoRefresh />

      <div className="flex-1 p-6">
        <div className="rounded-[32px] border border-black/5 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between border-b border-black/5 p-6">
            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                Оперативная лента
              </h1>

              <p className="mt-1 text-sm text-zinc-500">
                Самые свежие обращения всегда сверху.
              </p>
            </div>

            <div className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">
              {sortedTickets.length} обращений
            </div>
          </div>

          {!sortedTickets.length ? (
            <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500">
                <Inbox className="h-6 w-6" />
              </div>

              <h3 className="text-xl font-semibold tracking-tight">
                Пока нет обращений
              </h3>

              <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-500">
                Когда пользователь отправит сообщение через виджет, оно появится
                здесь.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-black/5">
              {sortedTickets.map((ticket) => {
                const activityAt =
                  ticket.messages[0]?.createdAt || ticket.createdAt;

                const readState = ticket.readStates[0];
                const lastReadAt = readState?.lastReadAt;

                const unreadCount = ticket.messages.filter((message) => {
                  if (message.senderType !== "customer") return false;
                  if (!lastReadAt) return true;

                  return message.createdAt > lastReadAt;
                }).length;

                const view = getStatusView(ticket.status);

                return (
                  <Link
                    key={ticket.id}
                    href={`/dashboard/tickets/${ticket.id}`}
                    className="group flex flex-col gap-5 p-6 transition hover:bg-zinc-50 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="mb-4 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${view.badge}`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${view.dot}`}
                          />
                          {view.label}
                        </span>

                        {unreadCount > 0 ? (
                          <span className="inline-flex items-center rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                            {unreadCount}
                          </span>
                        ) : null}

                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 ring-1 ring-blue-100">
                          {ticket.priority === "normal"
                            ? "Обычный приоритет"
                            : ticket.priority}
                        </span>

                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 ring-1 ring-emerald-100">
                          {ticket.source === "widget" ? "Виджет" : ticket.source}
                        </span>
                      </div>

                      <h3 className="truncate text-lg font-bold tracking-tight text-zinc-950">
                        {ticket.title}
                      </h3>

                      <p className="mt-2 text-sm text-zinc-500">
                        {ticket.customerName || "Без имени"} ·{" "}
                        {ticket.customerEmail || "email не указан"} ·{" "}
                        {formatDistanceToNow(activityAt, {
                          addSuffix: true,
                          locale: ru,
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-semibold text-zinc-400 transition group-hover:text-zinc-900">
                      Открыть
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}