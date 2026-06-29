"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Clipboard,
  RefreshCw,
  Sparkles,
  Target,
  Wand2,
} from "lucide-react";

type PilotInsight = {
  summary: string;
  suggestion: string;
};

export function TicketAiPanel({
  ticketId,
  isClosed,
}: {
  ticketId: string;
  isClosed: boolean;
}) {
  const refreshTimeoutRef = useRef<number | null>(null);

  const [insight, setInsight] = useState<PilotInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const loadInsight = useCallback(
    async ({ silent = false }: { silent?: boolean } = {}) => {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const [summaryResponse, replyResponse] = await Promise.all([
          fetch(`/api/tickets/${ticketId}/ai-summary`, {
            method: "POST",
          }),
          fetch(`/api/tickets/${ticketId}/ai-reply`, {
            method: "POST",
          }),
        ]);

        const summaryData = await summaryResponse.json();
        const replyData = await replyResponse.json();

        if (!summaryResponse.ok || !summaryData.ok) {
          setError(summaryData.error || "Не удалось загрузить сводку.");
          return;
        }

        if (!replyResponse.ok || !replyData.ok) {
          setError(replyData.error || "Не удалось подготовить ответ.");
          return;
        }

        setInsight({
          summary: summaryData.summary,
          suggestion: replyData.suggestion,
        });
      } catch {
        setError("Не удалось связаться со Вторым пилотом.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [ticketId]
  );

  useEffect(() => {
    loadInsight();

    function handleMessagesUpdated(event: Event) {
      const customEvent = event as CustomEvent<{ ticketId?: string }>;

      if (customEvent.detail?.ticketId !== ticketId) return;

      if (refreshTimeoutRef.current) {
        window.clearTimeout(refreshTimeoutRef.current);
      }

      refreshTimeoutRef.current = window.setTimeout(() => {
        loadInsight({ silent: true });
      }, 700);
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
  }, [loadInsight, ticketId]);

  function insertReply() {
    if (!insight?.suggestion || isClosed) return;

    window.dispatchEvent(
      new CustomEvent("pulsedesk:insert-ai-reply", {
        detail: {
          text: insight.suggestion,
        },
      })
    );
  }

  async function copyReply() {
    if (!insight?.suggestion) return;

    await navigator.clipboard.writeText(insight.suggestion);

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1400);
  }

  if (loading) {
    return (
      <div className="sticky top-6 rounded-[32px] border border-black/5 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white">
            <Sparkles className="h-5 w-5" />
          </div>

          <div>
            <div className="font-bold tracking-tight">Второй пилот</div>
            <div className="text-xs text-zinc-500">
              анализирует обращение
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="h-4 w-3/4 animate-pulse rounded-full bg-zinc-100" />
          <div className="h-4 w-full animate-pulse rounded-full bg-zinc-100" />
          <div className="h-4 w-2/3 animate-pulse rounded-full bg-zinc-100" />
        </div>
      </div>
    );
  }

  if (error || !insight) {
    return (
      <div className="sticky top-6 rounded-[32px] border border-red-100 bg-red-50 p-6">
        <div className="flex items-center gap-3 text-red-700">
          <AlertTriangle className="h-5 w-5" />
          <div className="font-semibold">Второй пилот недоступен</div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-red-600">
          {error || "Не удалось загрузить подсказки."}
        </p>

        <button
          onClick={() => loadInsight()}
          className="mt-5 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-red-700 ring-1 ring-red-100 transition hover:bg-red-100"
        >
          Повторить
        </button>
      </div>
    );
  }

  return (
    <div className="sticky top-6 space-y-5">
      <div className="rounded-[32px] border border-black/5 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">
              <Sparkles className="h-5 w-5" />
            </div>

            <div>
              <div className="font-bold tracking-tight">Второй пилот</div>
              <div className="text-xs text-zinc-500">
                кратко · спокойно · по делу
              </div>
            </div>
          </div>

          <button
            onClick={() => loadInsight()}
            disabled={refreshing}
            className="flex h-9 w-9 items-center justify-center rounded-2xl bg-zinc-50 text-zinc-500 ring-1 ring-black/5 transition hover:bg-zinc-100 hover:text-black disabled:opacity-50"
            title="Обновить подсказку"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        <div className="rounded-[26px] bg-zinc-950 p-5 text-white">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white/40">
            <Target className="h-4 w-4" />
            Что происходит
          </div>

          <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/90">
            {insight.summary}
          </p>
        </div>
      </div>

      <div className="rounded-[32px] border border-black/5 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Wand2 className="h-4 w-4 text-zinc-400" />
          <div className="text-sm font-bold text-zinc-900">
            Предлагаемый ответ
          </div>
        </div>

        <div className="rounded-[26px] bg-zinc-50 p-5">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">
            {insight.suggestion}
          </p>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={insertReply}
            disabled={isClosed}
            className="flex-1 rounded-2xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Вставить в ответ
          </button>

          <button
            onClick={copyReply}
            className="rounded-2xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-200"
          >
            {copied ? "Готово" : <Clipboard className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}