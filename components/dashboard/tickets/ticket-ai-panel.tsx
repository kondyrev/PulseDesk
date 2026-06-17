"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type AiStatusSuggestion = "waiting_operator" | "waiting_customer" | "resolved";

type AiSummary = {
  summary: string;
  sentiment: string;
  recommendedAction: string;
  suggestedReply: string;
  statusSuggestion: AiStatusSuggestion;
  statusReason: string;
};

const statusLabels: Record<AiStatusSuggestion, string> = {
  waiting_operator: "Требуется оператор",
  waiting_customer: "Ожидаем клиента",
  resolved: "Проблема решена",
};

const statusClasses: Record<AiStatusSuggestion, string> = {
  waiting_operator: "bg-orange-100 text-orange-700",
  waiting_customer: "bg-blue-100 text-blue-700",
  resolved: "bg-green-100 text-green-700",
};

function isKnownStatus(value: string): value is AiStatusSuggestion {
  return (
    value === "waiting_operator" ||
    value === "waiting_customer" ||
    value === "resolved"
  );
}

export function TicketAiPanel({ ticketId }: { ticketId: string }) {
  const refreshTimeoutRef = useRef<number | null>(null);

  const [data, setData] = useState<AiSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadSummary = useCallback(
    async ({ silent = false }: { silent?: boolean } = {}) => {
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
        setError(result.error || "ИИ не смог подготовить сводку.");
        return;
      }

      setData(result.summary);
    },
    [ticketId]
  );

  useEffect(() => {
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
  }, [loadSummary, ticketId]);

  function handleInsertReply() {
    if (!data?.suggestedReply) return;

    window.dispatchEvent(
      new CustomEvent("pulsedesk:insert-ai-reply", {
        detail: {
          text: data.suggestedReply,
        },
      })
    );
  }

  if (loading) {
    return (
      <div className="sticky top-6 rounded-[32px] border border-black/5 p-6 text-sm text-zinc-500">
        ИИ анализирует обращение...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="sticky top-6 rounded-[32px] border border-red-100 bg-red-50 p-6 text-sm font-medium text-red-600">
        {error || "Не удалось загрузить AI-сводку."}
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
          ИИ обновляет сводку по новым сообщениям...
        </div>
      ) : null}

      <div className="rounded-[32px] border border-black/5 bg-black p-6 text-white shadow-sm">
        <div className="mb-4 text-sm font-semibold text-white/50">
          Рекомендуемый ответ
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
        <div className="mb-4 text-sm font-semibold text-zinc-400">
          Рекомендуемое действие
        </div>

        <p className="text-sm leading-relaxed text-zinc-600">
          {data.recommendedAction}
        </p>
      </div>

      <div className="rounded-[32px] border border-black/5 p-6">
        <div className="mb-4 text-sm font-semibold text-zinc-400">
          Статус по мнению ИИ
        </div>

        <div
          className={`mb-4 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusClasses[status]}`}
        >
          {statusLabels[status]}
        </div>

        <p className="text-sm leading-relaxed text-zinc-600">
          {data.statusReason}
        </p>
      </div>

      <div className="rounded-[32px] border border-black/5 p-6">
        <div className="mb-4 text-sm font-semibold text-zinc-400">
          Настроение клиента
        </div>

        <div className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-sm font-semibold text-zinc-700">
          {data.sentiment}
        </div>
      </div>

      <div className="rounded-[32px] border border-black/5 p-6">
        <div className="mb-4 text-sm font-semibold text-zinc-400">
          Краткая сводка
        </div>

        <p className="leading-relaxed text-zinc-600">{data.summary}</p>
      </div>
    </div>
  );
}