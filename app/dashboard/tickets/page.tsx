import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { ArrowUpRight, Inbox, Search, X } from "lucide-react";

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

type TicketsFilter = "all" | "waiting_operator" | "waiting_customer";

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

function getFilter(value?: string): TicketsFilter {
  if (value === "waiting_operator" || value === "waiting_customer") {
    return value;
  }

  return "all";
}

function buildTicketsHref({
  filter,
  showClosed,
  query,
}: {
  filter: TicketsFilter;
  showClosed: boolean;
  query: string;
}) {
  const params = new URLSearchParams();

  if (filter !== "all") params.set("status", filter);
  if (showClosed) params.set("showClosed", "true");
  if (query) params.set("q", query);

  const search = params.toString();

  return search ? `/dashboard/tickets?${search}` : "/dashboard/tickets";
}

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    showClosed?: string;
    q?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;

  const activeFilter = getFilter(resolvedSearchParams.status);
  const showClosed = resolvedSearchParams.showClosed === "true";
  const searchQuery = String(resolvedSearchParams.q || "").trim();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

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

  const searchedTickets = searchQuery
    ? tickets.filter((ticket) => {
        const value = [
          ticket.title,
          ticket.customerName || "",
          ticket.customerEmail || "",
        ]
          .join(" ")
          .toLowerCase();

        return value.includes(searchQuery.toLowerCase());
      })
    : tickets;

  const activeTickets = searchedTickets.filter(
    (ticket) => ticket.status !== "closed"
  );

  const counts = {
    active: activeTickets.length,
    waiting_operator: searchedTickets.filter(
      (ticket) => ticket.status === "waiting_operator"
    ).length,
    waiting_customer: searchedTickets.filter(
      (ticket) => ticket.status === "waiting_customer"
    ).length,
    closed: searchedTickets.filter((ticket) => ticket.status === "closed")
      .length,
  };

  const visibleBaseTickets = showClosed ? searchedTickets : activeTickets;

  const filteredTickets =
    activeFilter === "all"
      ? visibleBaseTickets
      : visibleBaseTickets.filter((ticket) => ticket.status === activeFilter);

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    const aLast = a.messages[0]?.createdAt || a.createdAt;
    const bLast = b.messages[0]?.createdAt || b.createdAt;

    return bLast.getTime() - aLast.getTime();
  });

  const filters: Array<{
    value: TicketsFilter;
    label: string;
    count: number;
  }> = [
    {
      value: "all",
      label: "Все активные",
      count: counts.active,
    },
    {
      value: "waiting_operator",
      label: "Ждут оператора",
      count: counts.waiting_operator,
    },
    {
      value: "waiting_customer",
      label: "Ждут клиента",
      count: counts.waiting_customer,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f7f8]">
      <TicketsAutoRefresh />

      <div className="flex-1 p-6">
        <div className="rounded-[32px] border border-black/5 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <div className="border-b border-black/5 p-6">
            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                Оперативная лента
              </h1>

              <p className="mt-1 text-sm text-zinc-500">
                Самые свежие обращения всегда сверху.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {filters.map((filter) => {
                const active = filter.value === activeFilter;

                return (
                  <Link
                    key={filter.value}
                    href={buildTicketsHref({
                      filter: filter.value,
                      showClosed,
                      query: searchQuery,
                    })}
                    className={
                      active
                        ? "rounded-full bg-black px-4 py-2 text-sm font-semibold text-white"
                        : "rounded-full bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-200 hover:text-zinc-900"
                    }
                  >
                    {filter.label}
                    <span
                      className={
                        active
                          ? "ml-2 text-white/60"
                          : "ml-2 text-zinc-400"
                      }
                    >
                      {filter.count}
                    </span>
                  </Link>
                );
              })}

              <Link
                href={buildTicketsHref({
                  filter: activeFilter,
                  showClosed: !showClosed,
                  query: searchQuery,
                })}
                className={
                  showClosed
                    ? "ml-1 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white"
                    : "ml-1 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-600 ring-1 ring-black/10 transition hover:bg-zinc-50 hover:text-zinc-900"
                }
              >
                <span
                  className={
                    showClosed
                      ? "flex h-4 w-4 items-center justify-center rounded border border-white/50 bg-white text-[10px] text-black"
                      : "h-4 w-4 rounded border border-zinc-300 bg-white"
                  }
                >
                  {showClosed ? "✓" : ""}
                </span>
                Показать закрытые
                <span className={showClosed ? "text-white/60" : "text-zinc-400"}>
                  {counts.closed}
                </span>
              </Link>

              <form
                action="/dashboard/tickets"
                className="relative ml-auto w-full sm:w-[320px]"
              >
                {activeFilter !== "all" ? (
                  <input type="hidden" name="status" value={activeFilter} />
                ) : null}

                {showClosed ? (
                  <input type="hidden" name="showClosed" value="true" />
                ) : null}

                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

                <input
                  name="q"
                  defaultValue={searchQuery}
                  placeholder="Поиск обращения..."
                  className="h-10 w-full rounded-2xl border border-black/5 bg-zinc-50 pl-11 pr-11 text-sm outline-none transition placeholder:text-zinc-400 focus:border-black/10 focus:bg-white"
                />

                {searchQuery ? (
                  <Link
                    href={buildTicketsHref({
                      filter: activeFilter,
                      showClosed,
                      query: "",
                    })}
                    className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-200 hover:text-zinc-700"
                    aria-label="Очистить поиск"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Link>
                ) : null}
              </form>
            </div>
          </div>

          {!sortedTickets.length ? (
            <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500">
                <Inbox className="h-6 w-6" />
              </div>

              <h3 className="text-xl font-semibold tracking-tight">
                В этом фильтре пока пусто
              </h3>

              <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-500">
                Когда появятся подходящие обращения, они будут показаны здесь.
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
                          {ticket.source === "widget"
                            ? "Виджет"
                            : ticket.source}
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