import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { ArrowUpRight, Inbox } from "lucide-react";

import { TicketsAutoRefresh } from "@/components/dashboard/tickets/tickets-auto-refresh";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    <div className="flex min-h-screen flex-col">
      <TicketsAutoRefresh />

      <div className="border-b border-black/5 bg-white px-8 py-5">
        <h1 className="text-2xl font-semibold tracking-tight">Обращения</h1>

        <p className="mt-1 text-sm text-black/50">
          Сообщения клиентов, созданные через виджет поддержки.
        </p>
      </div>

      <div className="flex-1 p-6">
        <div className="rounded-[28px] border border-black/5 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between border-b border-black/5 p-6">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Входящие обращения
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Новые сообщения с сайта клиента.
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
                const lastCustomerMessage = ticket.messages.find(
                  (message) => message.senderType === "customer"
                );

                const lastOperatorMessage = ticket.messages.find(
                  (message) => message.senderType === "operator"
                );

                const needsReply =
                  ticket.status !== "closed" &&
                  !!lastCustomerMessage &&
                  (!lastOperatorMessage ||
                    lastCustomerMessage.createdAt > lastOperatorMessage.createdAt);

                const activityAt = ticket.messages[0]?.createdAt || ticket.createdAt;

                return (
                  <Link
                    key={ticket.id}
                    href={`/dashboard/tickets/${ticket.id}`}
                    className="flex flex-col gap-5 p-6 transition hover:bg-zinc-50 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div>
                      <div className="mb-3 flex flex-wrap gap-2">
                        {needsReply ? (
                          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                            Ждёт ответа
                          </span>
                        ) : null}

                        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">
                          {ticket.status === "new"
                            ? "Новое"
                            : ticket.status === "closed"
                              ? "Закрыто"
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

                      <h3 className="text-lg font-bold tracking-tight">
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

                    <div className="flex items-center gap-2 text-sm font-semibold text-zinc-500">
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