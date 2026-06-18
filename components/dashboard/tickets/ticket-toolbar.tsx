"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type TicketStatus =
  | "new"
  | "open"
  | "waiting_operator"
  | "waiting_customer"
  | "resolved"
  | "closed";

type TicketPriority = "low" | "normal" | "high" | "urgent";

const statusLabels: Record<TicketStatus, string> = {
  new: "Новое",
  open: "В работе",
  waiting_operator: "Ждёт оператора",
  waiting_customer: "Ждёт клиента",
  resolved: "Решено",
  closed: "Закрыто",
};

const priorityLabels: Record<TicketPriority, string> = {
  low: "Низкий",
  normal: "Обычный",
  high: "Высокий",
  urgent: "Срочный",
};

export function TicketToolbar({
  ticketId,
  status,
  priority,
}: {
  ticketId: string;
  status: TicketStatus;
  priority: TicketPriority;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);

  async function updateTicket(data: {
    status?: TicketStatus;
    priority?: TicketPriority;
  }) {
    setLoading(true);

    const response = await fetch(`/api/tickets/${ticketId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (!response.ok) {
      alert("Не удалось обновить обращение.");
      return;
    }

    router.refresh();
  }

  async function handleCloseTicket() {
    await updateTicket({
      status: "closed",
    });

    setShowCloseDialog(false);
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <label className="flex items-center gap-2 rounded-2xl bg-zinc-50 px-3 py-2 text-sm ring-1 ring-black/5">
          <span className="text-xs font-semibold text-zinc-400">Статус</span>

          <select
            value={status}
            disabled={loading}
            onChange={(event) =>
              updateTicket({
                status: event.target.value as TicketStatus,
              })
            }
            className="bg-transparent text-sm font-semibold text-zinc-900 outline-none disabled:opacity-50"
          >
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 rounded-2xl bg-zinc-50 px-3 py-2 text-sm ring-1 ring-black/5">
          <span className="text-xs font-semibold text-zinc-400">
            Приоритет
          </span>

          <select
            value={priority}
            disabled={loading}
            onChange={(event) =>
              updateTicket({
                priority: event.target.value as TicketPriority,
              })
            }
            className="bg-transparent text-sm font-semibold text-zinc-900 outline-none disabled:opacity-50"
          >
            {Object.entries(priorityLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          disabled={loading || status === "closed"}
          onClick={() => setShowCloseDialog(true)}
          className="rounded-2xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Закрыть
        </button>
      </div>

      {showCloseDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold tracking-tight">
              Закрыть обращение?
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-zinc-600">
              После закрытия обращение перейдёт в архив. Клиент больше не сможет
              продолжать переписку до повторного открытия обращения.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCloseDialog(false)}
                className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
              >
                Отмена
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleCloseTicket}
                className="rounded-2xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                Подтвердить закрытие
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}