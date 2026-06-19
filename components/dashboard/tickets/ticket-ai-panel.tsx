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

type OperatorInsight = {
  signal: string;
  hiddenRisk: string;
  bestReply: string;
  shortReply: string;
  warmReply: string;
  formalReply: string;
  questionsToAsk: string[];
  dontDo: string[];
  nextStep: string;
};

export function TicketAiPanel({
  ticketId,
  isClosed,
}: {
  ticketId: string;
  isClosed: boolean;
}) {
  const refreshTimeoutRef = useRef<number | null>(null);

  const [insight, setInsight] = useState<OperatorInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
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
        const response = await fetch(`/api/tickets/${ticketId}/ai-summary`, {
          method: "POST",
        });

        const result = await response.json();

        if (!response.ok || !result.ok) {
          setError(result.error || "Не удалось подготовить подсказки.");
          return;
        }

        setInsight(result.insight);
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
    if (!insight?.bestReply || isClosed) return;

    window.dispatchEvent(
      new CustomEvent("pulsedesk:insert-ai-reply", {
        detail: {
          text: insight.bestReply,
        },
      })
    );
  }

  async function copyReply() {
    if (!insight?.bestReply) return;

    await navigator.clipboard.writeText(insight.bestReply);

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
              ищет лучший следующий шаг
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
                1 мысль · 1 действие · 1 ответ
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
          <div className="mb-2 text-xs font-bold uppercase tracking-wide text-white/40">
            Сигнал
          </div>

          <p className="text-sm leading-relaxed text-white/90">
            {insight.signal}
          </p>
        </div>

        <div className="mt-4 rounded-[26px] bg-zinc-50 p-5">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-zinc-400">
            <Target className="h-4 w-4" />
            Следующий шаг
          </div>

          <p className="text-sm leading-relaxed text-zinc-800">
            {insight.nextStep}
          </p>
        </div>
      </div>

      <div className="rounded-[32px] border border-black/5 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Wand2 className="h-4 w-4 text-zinc-400" />
          <div className="text-sm font-bold text-zinc-900">
            Лучший ответ сейчас
          </div>
        </div>

        <div className="rounded-[26px] bg-zinc-50 p-5">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">
            {insight.bestReply}
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

      <div className="rounded-[32px] border border-black/5 bg-white p-6 shadow-sm">
        <button
          type="button"
          onClick={() => setDetailsOpen((value) => !value)}
          className="flex w-full items-center justify-between text-left"
        >
          <span className="text-sm font-bold text-zinc-900">
            Почему пилот так думает
          </span>

          <span className="text-xs font-semibold text-zinc-400">
            {detailsOpen ? "Скрыть" : "Показать"}
          </span>
        </button>

        {detailsOpen ? (
          <div className="mt-5 space-y-5">
            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-wide text-red-400">
                Скрытый риск
              </div>

              <p className="text-sm leading-relaxed text-zinc-700">
                {insight.hiddenRisk}
              </p>
            </div>

            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-wide text-zinc-400">
                Что уточнить
              </div>

              <div className="space-y-3">
                {insight.questionsToAsk.map((item, index) => (
                  <div key={`${item}-${index}`} className="flex gap-3 text-sm">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-500">
                      {index + 1}
                    </span>

                    <span className="leading-relaxed text-zinc-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-wide text-zinc-400">
                Чего не делать
              </div>

              <div className="space-y-3">
                {insight.dontDo.map((item, index) => (
                  <div key={`${item}-${index}`} className="flex gap-3 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                    <span className="leading-relaxed text-zinc-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] bg-zinc-50 p-4">
              <div className="mb-3 text-xs font-bold uppercase tracking-wide text-zinc-400">
                Другие варианты ответа
              </div>

              <div className="space-y-4 text-sm leading-relaxed text-zinc-700">
                <div>
                  <div className="mb-1 font-semibold text-zinc-900">
                    Коротко
                  </div>
                  {insight.shortReply}
                </div>

                <div>
                  <div className="mb-1 font-semibold text-zinc-900">
                    Мягче
                  </div>
                  {insight.warmReply}
                </div>

                <div>
                  <div className="mb-1 font-semibold text-zinc-900">
                    Официально
                  </div>
                  {insight.formalReply}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}