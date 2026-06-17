"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type AiStatusSuggestion = "waiting_operator" | "waiting_customer" | "resolved";

type AiSummary = {
  summary: string;
  sentiment: string;
  recommendedAction: string;
  suggestedReply: string;
  statusSuggestion: AiStatusSuggestion;
  statusReason: string;
};

function isKnownStatus(value: string): value is AiStatusSuggestion {
  return (
    value === "waiting_operator" ||
    value === "waiting_customer" ||
    value === "resolved"
  );
}

export function TicketAiPanel({
  ticketId,
  isClosed,
}: {
  ticketId: string;
  isClosed: boolean;
}) {
  const router = useRouter();
  const refreshTimeoutRef = useRef<number | null>(null);

  const [data, setData] = useState<AiSummary | null>(null);
  const [loading, setLoading] = useState(!isClosed);
  const [refreshing, setRefreshing] = useState(false);
  const [closing, setClosing] = useState(false);
  const [closed, setClosed] = useState(isClosed);
  const [error, setError] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const loadSummary = useCallback(
    async ({ silent = false }: { silent?: boolean } = {}) => {
      if (closed) return;

      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch(`/api/tickets/${ticketId}/ai-summary`, {
        method: "POST",
      });

      const result = await response.json();

      setLoading(false);
      setRefreshing(false);

      if (!response.ok || !result.ok) {
        setError(result.error || "Не удалось подготовить рекомендации.");
        return;
      }

      setData(result.summary);
    },
    [closed, ticketId]
  );

  useEffect(() => {
    if (closed) return;

    loadSummary();

    function handleMessagesUpdated(event: Event) {
      const customEvent = event as CustomEvent<{ ticketId?: string }>;

      if (customEvent.detail?.ticketId !== ticketId) {
        return;
      }

      if (refreshTimeoutRef.current) {
        window.clearTimeout(refreshTimeoutRef.current);
      }

      refreshTimeoutRef.current = window.setTimeout(() => {
        loadSummary({ silent: true });
      }, 600);
    }

    window.addEventListener("pulsedesk:messages-updated", handleMessagesUpdated);

    return () => {
      if (refreshTimeoutRef.current) {
        window.clearTimeout(refreshTimeoutRef.current);
      }

      window.removeEventListener(
        "pulsedesk:messages-updated",
        handleMessagesUpdated
      );
    };
  }, [closed, loadSummary, ticketId]);

  function handleInsertReply() {
    if (!data?.suggestedReply || closed) return;

    window.dispatchEvent(
      new CustomEvent("pulsedesk:insert-ai-reply", {
        detail: {
          text: data.suggestedReply,
        },
      })
    );
  }

  async function handleCloseTicket() {
    setClosing(true);
    setError("");

    const response = await fetch(`/api/tickets/${ticketId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "closed",
      }),
    });

    const result = await response.json();

    setClosing(false);

    if (!response.ok || !result.ok) {
      setError(result.error || "Не удалось закрыть обращение.");
      return;
    }

    setClosed(true);
    setData(null);

    window.dispatchEvent(
      new CustomEvent("pulsedesk:ticket-closed", {
        detail: {
          ticketId,
        },
      })
    );

    router.refresh();
  }

  if (closed) {
    return (
      <div className="sticky top-6 space-y-6">
        <div className="rounded-[32px] border border-emerald-200 bg-emerald-50 p-6">
          <div className="text-base font-semibold text-emerald-700">
            ✓ Обращение закрыто
          </div>

          <p className="mt-2 text-sm text-emerald-600">
            Новые сообщения и рекомендации недоступны.
          </p>
        </div>

        <div className="rounded-[32px] border border-black/5 p-6">
          <div className="text-sm font-semibold text-zinc-500">
            История обращения сохранена.
          </div>

          <p className="mt-2 text-sm leading-relaxed text-zinc-500">
            При необходимости клиент сможет создать новое обращение через
            виджет поддержки.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="sticky top-6 rounded-[32px] border border-black/5 p-6 text-sm text-zinc-500">
        Подготавливаем рекомендации...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="sticky top-6 rounded-[32px] border border-red-100 bg-red-50 p-6 text-sm font-medium text-red-600">
        {error || "Не удалось загрузить рекомендации."}
      </div>
    );
  }

  const status = isKnownStatus(data.statusSuggestion)
    ? data.statusSuggestion
    : "waiting_operator";

  return (
    <div className="sticky top-6 space-y-6">
      {refreshing ? (
        <div className="rounded-[24px] border border-blue-100 bg-blue-50 px-5 py-4 text-sm font-medium text-blue-700">
          Обновляем рекомендации...
        </div>
      ) : null}

      <div className="rounded-[32px] border border-black/5 bg-black p-6 text-white shadow-sm">
        <div className="mb-4 text-sm font-semibold text-white/50">
          Ответить клиенту
        </div>

        <p className="text-sm leading-relaxed text-white/85">
          {data.suggestedReply}
        </p>

        <button
          onClick={handleInsertReply}
          className="mt-4 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
        >
          Вставить в ответ
        </button>
      </div>

      <div className="rounded-[32px] border border-black/5 p-6">
        <div className="mb-3 text-sm font-semibold text-zinc-400">
          Следующий шаг
        </div>

        <p className="text-sm leading-relaxed text-zinc-700">
          {data.recommendedAction}
        </p>
      </div>

      <div className="rounded-[32px] border border-black/5 p-6">
        {status === "resolved" ? (
          <>
            <div className="text-base font-semibold text-green-700">
              ✓ Можно закрыть обращение
            </div>

            <p className="mt-2 text-sm text-zinc-600">
              Клиент подтвердил решение вопроса.
            </p>

            <button
              onClick={handleCloseTicket}
              disabled={closing}
              className="mt-4 rounded-2xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {closing ? "Закрываем..." : "Закрыть обращение"}
            </button>
          </>
        ) : null}

        {status === "waiting_customer" ? (
          <>
            <div className="text-base font-semibold text-blue-700">
              ⏳ Ждём клиента
            </div>

            <p className="mt-2 text-sm text-zinc-600">
              Последнее действие выполнено оператором.
            </p>
          </>
        ) : null}

        {status === "waiting_operator" ? (
          <>
            <div className="text-base font-semibold text-orange-700">
              ⚠ Нужен ответ оператора
            </div>

            <p className="mt-2 text-sm text-zinc-600">
              Клиент ожидает реакцию службы поддержки.
            </p>
          </>
        ) : null}
      </div>

      <div className="rounded-[32px] border border-black/5 p-6">
        <button
          onClick={() => setShowDetails((value) => !value)}
          className="text-sm font-semibold text-zinc-600 hover:text-black"
        >
          {showDetails
            ? "Скрыть детали обращения"
            : "Показать детали обращения"}
        </button>

        {showDetails ? (
          <div className="mt-6 space-y-6">
            <div>
              <div className="mb-2 text-sm font-semibold text-zinc-400">
                Краткая сводка
              </div>

              <p className="text-sm leading-relaxed text-zinc-600">
                {data.summary}
              </p>
            </div>

            <div>
              <div className="mb-2 text-sm font-semibold text-zinc-400">
                Настроение клиента
              </div>

              <div className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-sm font-semibold text-zinc-700">
                {data.sentiment}
              </div>
            </div>

            <div>
              <div className="mb-2 text-sm font-semibold text-zinc-400">
                Причина рекомендации
              </div>

              <p className="text-sm leading-relaxed text-zinc-600">
                {data.statusReason}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}