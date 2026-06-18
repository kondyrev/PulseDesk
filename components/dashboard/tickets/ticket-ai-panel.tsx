"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Clipboard,
  RefreshCw,
  Sparkles,
  Wand2,
} from "lucide-react";

type AiStatusSuggestion =
  | "waiting_operator"
  | "waiting_customer"
  | "resolved"
  | "closed";

type AiSummary = {
  summary: string;
  important: string;
  customerIntent: string;
  sentiment: string;
  urgency: string;
  risk: string;
  recommendedAction: string;
  nextStep: string;
  suggestedReply: string;
  statusSuggestion: AiStatusSuggestion;
  statusReason: string;
  checklist: string[];
};

function getStatusLabel(status: AiStatusSuggestion) {
  if (status === "waiting_operator") return "Ждёт оператора";
  if (status === "waiting_customer") return "Ждёт клиента";
  if (status === "resolved") return "Решено";
  if (status === "closed") return "Закрыто";

  return status;
}

function getStatusClass(status: AiStatusSuggestion) {
  if (status === "resolved" || status === "closed") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  }

  if (status === "waiting_customer") {
    return "bg-amber-50 text-amber-700 ring-amber-100";
  }

  return "bg-red-50 text-red-700 ring-red-100";
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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [applyingStatus, setApplyingStatus] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const loadSummary = useCallback(
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
          setError(result.error || "Не удалось подготовить рекомендации.");
          return;
        }

        setData(result.summary);
      } catch {
        setError("Не удалось связаться с ИИ-помощником.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [ticketId]
  );

  useEffect(() => {
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
  }, [loadSummary, ticketId]);

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

  async function applyStatus() {
    if (!data?.statusSuggestion) return;

    setApplyingStatus(true);

    const response = await fetch(`/api/tickets/${ticketId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status:
          data.statusSuggestion === "resolved"
            ? "resolved"
            : data.statusSuggestion,
      }),
    });

    setApplyingStatus(false);

    if (!response.ok) {
      setError("Не удалось применить статус.");
      return;
    }

    router.refresh();
  }

  if (loading) {
    return (
      <div className="sticky top-6 space-y-4">
        <div className="rounded-[32px] border border-black/5 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white">
              <Sparkles className="h-5 w-5" />
            </div>

            <div>
              <div className="font-bold tracking-tight">ИИ-помощник</div>
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
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="sticky top-6 rounded-[32px] border border-red-100 bg-red-50 p-6">
        <div className="flex items-center gap-3 text-red-700">
          <AlertTriangle className="h-5 w-5" />
          <div className="font-semibold">ИИ-помощник недоступен</div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-red-600">
          {error || "Не удалось загрузить рекомендации."}
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
      <div className="rounded-[32px] border border-black/5 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">
              <Sparkles className="h-5 w-5" />
            </div>

            <div>
              <div className="font-bold tracking-tight">ИИ-помощник</div>
              <div className="text-xs text-zinc-500">
                рядом с оператором, не вместо него
              </div>
            </div>
          </div>

          <button
            onClick={() => loadSummary()}
            disabled={refreshing}
            className="flex h-9 w-9 items-center justify-center rounded-2xl bg-zinc-50 text-zinc-500 ring-1 ring-black/5 transition hover:bg-zinc-100 hover:text-black disabled:opacity-50"
            title="Обновить анализ"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        <div className="rounded-[24px] bg-zinc-50 p-5">
          <div className="mb-2 text-xs font-bold uppercase tracking-wide text-zinc-400">
            Кратко
          </div>

          <p className="text-sm leading-relaxed text-zinc-700">
            {data.summary}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-[22px] bg-zinc-50 p-4">
            <div className="text-xs font-semibold text-zinc-400">
              Настроение
            </div>
            <div className="mt-1 text-sm font-bold text-zinc-800">
              {data.sentiment}
            </div>
          </div>

          <div className="rounded-[22px] bg-zinc-50 p-4">
            <div className="text-xs font-semibold text-zinc-400">
              Срочность
            </div>
            <div className="mt-1 text-sm font-bold text-zinc-800">
              {data.urgency}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-black/5 bg-white p-6 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Wand2 className="h-4 w-4 text-zinc-400" />
          <div className="text-sm font-bold text-zinc-900">
            Черновик ответа
          </div>
        </div>

        <p className="text-sm leading-relaxed text-zinc-700">
          {data.suggestedReply}
        </p>

        <div className="mt-5 flex gap-2">
          <button
            onClick={insertReply}
            disabled={isClosed}
            className="flex-1 rounded-2xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Вставить
          </button>

          <button
            onClick={copyReply}
            className="rounded-2xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-200"
          >
            {copied ? "Скопировано" : <Clipboard className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="rounded-[32px] border border-black/5 bg-white p-6 shadow-sm">
        <div className="mb-3 text-sm font-bold text-zinc-900">
          Следующий лучший шаг
        </div>

        <p className="text-sm leading-relaxed text-zinc-700">
          {data.nextStep}
        </p>

        <div className="mt-4 rounded-[22px] bg-zinc-50 p-4">
          <div className="mb-2 text-xs font-semibold text-zinc-400">
            Почему
          </div>

          <p className="text-sm leading-relaxed text-zinc-600">
            {data.recommendedAction}
          </p>
        </div>
      </div>

      <div className="rounded-[32px] border border-black/5 bg-white p-6 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="text-sm font-bold text-zinc-900">
            Рекомендованный статус
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusClass(
              data.statusSuggestion
            )}`}
          >
            {getStatusLabel(data.statusSuggestion)}
          </span>
        </div>

        <p className="text-sm leading-relaxed text-zinc-600">
          {data.statusReason}
        </p>

        <button
          onClick={applyStatus}
          disabled={applyingStatus || isClosed}
          className="mt-5 w-full rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {applyingStatus ? "Применяем..." : "Применить статус"}
        </button>
      </div>

      <div className="rounded-[32px] border border-black/5 bg-white p-6 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <div className="text-sm font-bold text-zinc-900">
            Чек-лист оператора
          </div>
        </div>

        <div className="space-y-3">
          {data.checklist.map((item, index) => (
            <div key={`${item}-${index}`} className="flex gap-3 text-sm">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-500">
                {index + 1}
              </span>

              <span className="leading-relaxed text-zinc-700">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[32px] border border-black/5 bg-white p-6 shadow-sm">
        <div className="mb-3 text-sm font-bold text-zinc-900">
          Что важно не упустить
        </div>

        <p className="text-sm leading-relaxed text-zinc-700">
          {data.important}
        </p>

        <div className="mt-4 rounded-[22px] bg-zinc-50 p-4">
          <div className="mb-2 text-xs font-semibold text-zinc-400">
            Намерение клиента
          </div>

          <p className="text-sm leading-relaxed text-zinc-600">
            {data.customerIntent}
          </p>
        </div>

        <div className="mt-3 rounded-[22px] bg-zinc-50 p-4">
          <div className="mb-2 text-xs font-semibold text-zinc-400">
            Риск
          </div>

          <p className="text-sm leading-relaxed text-zinc-600">
            {data.risk}
          </p>
        </div>
      </div>
    </div>
  );
}