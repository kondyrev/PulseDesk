"use client";

import { useEffect, useState } from "react";

type AiSummary = {
  summary: string;
  sentiment: string;
  recommendedAction: string;
  suggestedReply: string;
};

export function TicketAiPanel({ ticketId }: { ticketId: string }) {
  const [data, setData] = useState<AiSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSummary() {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/tickets/${ticketId}/ai-summary`, {
        method: "POST",
      });

      const result = await response.json();

      setLoading(false);

      if (!response.ok || !result.ok) {
        setError(result.error || "ИИ не смог подготовить сводку.");
        return;
      }

      setData(result.summary);
    }

    loadSummary();
  }, [ticketId]);

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

  return (
    <div className="sticky top-6 space-y-6">
      <div className="rounded-[32px] border border-black/5 p-6">
        <div className="mb-4 text-sm font-semibold text-zinc-400">
          Краткая сводка
        </div>

        <p className="leading-relaxed text-zinc-600">{data.summary}</p>
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
          Рекомендуемое действие
        </div>

        <p className="text-sm leading-relaxed text-zinc-600">
          {data.recommendedAction}
        </p>
      </div>

      <div className="rounded-[32px] border border-black/5 p-6">
        <div className="mb-4 text-sm font-semibold text-zinc-400">
          Рекомендуемый ответ
        </div>

        <p className="text-sm leading-relaxed text-zinc-600">
          {data.suggestedReply}
        </p>

        <button
          onClick={handleInsertReply}
          className="mt-4 rounded-2xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Вставить в ответ
        </button>
      </div>
    </div>
  );
}