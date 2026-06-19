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

type AiStatusSuggestion = "waiting_operator" | "waiting_customer" | "resolved";

type AiSummary = {
  summary: string;
  sentiment: string;
  recommendedAction: string;
  suggestedReply: string;
  statusSuggestion: AiStatusSuggestion;
  statusReason: string;
};

export function TicketAiPanel({
  ticketId,
  isClosed,
}: {
  ticketId: string;
  isClosed: boolean;
}) {
  const refreshTimeoutRef = useRef<number | null>(null);

  const [data, setData] = useState<AiSummary | null>(null);
  const [loading, setLoading] = useState(!isClosed);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [error, setError] = useState("");

  const loadSummary = useCallback(
    async ({ silent = false }: { silent?: boolean } = {}) => {
      if (isClosed) return;

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
          setError(result.error || "Не удалось подготовить подсказку.");
          return;
        }

        setData(result.summary);
      } catch {
        setError("Не удалось связаться со Вторым пилотом.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [isClosed, ticketId]
  );

  useEffect(() => {
    if (isClosed) return;

    loadSummary();

    function handleMessagesUpdated(event: Event) {
      const customEvent = event as CustomEvent<{ ticketId?: string }>;

      if (customEvent.detail?.ticketId !== ticketId) return;

      if (refreshTimeoutRef.current) {
        window.clearTimeout(refreshTimeoutRef.current);
      }

      refreshTimeoutRef.current = window.setTimeout(() => {
        loadSummary({ silent: true });
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
  }, [isClosed, loadSummary, ticketId]);

  function insertReply() {
    if (!data?.suggestedReply || isClosed) return;

    window.dispatchEvent(
      new CustomEvent("pulsedesk:insert-ai-reply", {
        detail: {
          text: data.suggestedReply,
        },
      })
    );
  }

  async function copyReply() {
    if (!data?.suggestedReply) return;

    await navigator.clipboard.writeText(data.suggestedReply);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1400);
  }

  if (isClosed) {
    return (
      <div className="sticky top-6 rounded-[32px] border border-emerald-200 bg-emerald-50 p-6">
        <div className="text-base font-semibold text-emerald-700">
          ✓ Обращение закрыто
        </div>

        <p className="mt-2 text-sm text-emerald-600">
          Второй пилот сохранит контекст, но новые подсказки недоступны.
        </p>
      </div>
    );
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

  if (error || !data) {
    return (
      <div className="sticky top-6 rounded-[32px] border border-red-100 bg-red-50 p-6">
        <div className="flex items-center gap-3 text-red-700">
          <AlertTriangle className="h-5 w-5" />
          <div className="font-semibold">Второй пилот недоступен</div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-red-600">
          {error || "Не удалось загрузить подсказку."}
        </p>

        <button
          onClick={() => loadSummary()}
          className="mt-5 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-red-700 ring-1 ring-red-100 transition hover:bg-red-100"
        >
          Повторить
        </button>
      </div>
    );
  }

  return (
    <div className="sticky top-6 space-y-5">
      {refreshing ? (
        <div className="rounded-[24px] border border-blue-100 bg-blue-50 px-5 py-4 text-sm font-medium text-blue-700">
          Второй пилот обновляет подсказку...
        </div>
      ) : null}

      <div className="rounded-[32px] border border-black/5 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">
              <Sparkles className="h-5 w-5" />
            </div>

            <div>
              <div className="font-bold tracking-tight">Второй пилот</div>
              <div className="mt-1 inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-500">
                1 мысль · 1 действие · 1 ответ
              </div>
            </div>
          </div>

          <button
            onClick={() => loadSummary()}
            disabled={refreshing}
            className="flex h-9 w-9 items-center justify-center rounded-2xl bg-zinc-50 text-zinc-500 ring-1 ring-black/5 transition hover:bg-zinc-100 hover:text-black disabled:opacity-50"
            title="Обновить подсказку"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        <div className="rounded-[26px] border border-amber-200 bg-amber-50 p-5">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-amber-600">
            <AlertTriangle className="h-4 w-4" />
            Что происходит
          </div>

          <p className="text-sm leading-relaxed text-amber-900">
            {data.summary}
          </p>
        </div>

        <div className="mt-4 rounded-[26px] border border-emerald-200 bg-emerald-50 p-5">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-emerald-600">
            <Target className="h-4 w-4" />
            Что делать дальше
          </div>

          <p className="text-sm leading-relaxed text-emerald-900">
            {data.recommendedAction}
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
            {data.suggestedReply}
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
            title="Скопировать ответ"
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
              <div className="mb-2 text-xs font-bold uppercase tracking-wide text-zinc-400">
                Настроение клиента
              </div>

              <div className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-sm font-semibold text-zinc-700">
                {data.sentiment}
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-wide text-zinc-400">
                Причина рекомендации
              </div>

              <p className="text-sm leading-relaxed text-zinc-600">
                {data.statusReason}
              </p>
            </div>

            {data.statusSuggestion === "waiting_customer" ? (
              <div className="rounded-[24px] bg-blue-50 p-4">
                <div className="text-sm font-semibold text-blue-700">
                  Сейчас ждём клиента
                </div>

                <p className="mt-2 text-sm leading-relaxed text-blue-600">
                  Последнее действие выполнено оператором. Лучше не дублировать
                  ответ без новой информации.
                </p>
              </div>
            ) : null}

            {data.statusSuggestion === "waiting_operator" ? (
              <div className="rounded-[24px] bg-amber-50 p-4">
                <div className="text-sm font-semibold text-amber-700">
                  Нужна реакция оператора
                </div>

                <p className="mt-2 text-sm leading-relaxed text-amber-700">
                  Клиент ожидает ответа или конкретного следующего шага.
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}