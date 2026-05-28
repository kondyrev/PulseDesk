import { notFound } from "next/navigation";

import { TicketAutoRefresh } from "@/components/dashboard/tickets/ticket-auto-refresh";
import { TicketReplyForm } from "@/components/dashboard/tickets/ticket-reply-form";
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
    .select("*")
    .eq("ticket_id", ticket.id)
    .order("created_at", { ascending: true });

  return (
    <>
      <TicketAutoRefresh />

      <div className="grid h-full min-h-0 grid-cols-[minmax(0,1fr)_360px] overflow-hidden">
        <div className="grid min-h-0 min-w-0 grid-rows-[auto_minmax(0,1fr)_auto] border-r border-black/5 bg-[#f6f7f8]">
          <div className="shrink-0 border-b border-black/5 bg-white px-8 py-6">
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

          <div id="ticket-messages-scroll" className="min-h-0 overflow-y-auto p-8">
            <div className="space-y-6">
              {messages?.map((message) => {
                const isCustomer =
                  message.sender_type === "customer";

                return (
                  <div
                    key={message.id}
                    className={`flex w-full ${
                      isCustomer
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <div
                      className={`w-fit max-w-2xl rounded-[28px] px-6 py-5 shadow-sm ${
                        isCustomer
                          ? "bg-white"
                          : "bg-black text-white"
                      }`}
                    >
                      <div className="mb-3 text-xs font-semibold uppercase tracking-wide opacity-50">
                        {isCustomer
                          ? "Клиент"
                          : "Оператор"}
                      </div>

                      <div className="leading-relaxed">
                        {message.content}
                      </div>

                      {message.page_url ? (
                        <div className="mt-4 border-t border-black/5 pt-3 text-xs text-zinc-400">
                          Страница обращения:
                          <div className="mt-1 break-all">
                            {message.page_url}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-black/5 bg-white p-6">
            <TicketReplyForm ticketId={ticket.id} />
          </div>
        </div>

        <aside className="h-full overflow-y-auto bg-white p-6">
          <div className="sticky top-6 space-y-6">
            <div className="rounded-[32px] border border-black/5 p-6">
              <div className="mb-4 text-sm font-semibold text-zinc-400">
                Краткая сводка
              </div>

              <p className="leading-relaxed text-zinc-600">
                Клиент обратился через виджет
                поддержки. Требуется проверить
                обращение и подготовить ответ.
              </p>
            </div>

            <div className="rounded-[32px] border border-black/5 p-6">
              <div className="mb-4 text-sm font-semibold text-zinc-400">
                Настроение клиента
              </div>

              <div className="inline-flex rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-600">
                Требует внимания
              </div>
            </div>

            <div className="rounded-[32px] border border-black/5 p-6">
              <div className="mb-4 text-sm font-semibold text-zinc-400">
                Рекомендуемый ответ
              </div>

              <p className="text-sm leading-relaxed text-zinc-600">
                Здравствуйте! Спасибо за обращение.
                Мы уже изучаем информацию и скоро
                вернемся с ответом.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}