"use client";

import { useEffect, useState } from "react";

export function TicketReplyForm({ ticketId }: { ticketId: string }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function handleInsertAiReply(event: Event) {
      const customEvent = event as CustomEvent<{ text: string }>;

      if (!customEvent.detail?.text) return;

      setContent(customEvent.detail.text);
      setError("");
    }

    window.addEventListener("pulsedesk:insert-ai-reply", handleInsertAiReply);

    return () => {
      window.removeEventListener(
        "pulsedesk:insert-ai-reply",
        handleInsertAiReply
      );
    };
  }, []);

  async function handleSuggestReply() {
    setAiLoading(true);
    setError("");

    const response = await fetch(`/api/tickets/${ticketId}/ai-reply`, {
      method: "POST",
    });

    const data = await response.json();

    setAiLoading(false);

    if (!response.ok || !data.ok) {
      setError(data.error || "ИИ не смог предложить ответ.");
      return;
    }

    setContent(data.suggestion || "");
  }

  async function handleSubmit() {
    const text = content.trim();

    if (!text) {
      setError("Напишите ответ клиенту.");
      return;
    }

    setLoading(true);
    setError("");

    const response = await fetch(`/api/tickets/${ticketId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: text }),
    });

    const data = await response.json();

    setLoading(false);

    if (!response.ok || !data.ok) {
      setError(data.error || "Не удалось отправить сообщение.");
      return;
    }

    setContent("");
  }

  return (
    <div className="rounded-[32px] border border-black/5 bg-[#f6f7f8] p-4">
      <textarea
        value={content}
        onChange={(event) => {
          setContent(event.target.value);
          setError("");
        }}
        placeholder={
          aiLoading
            ? "ИИ анализирует обращение..."
            : "Напишите ответ клиенту..."
        }
        disabled={aiLoading}
        className="h-32 w-full resize-none bg-transparent text-sm outline-none disabled:cursor-wait disabled:opacity-60"
      />

      {error ? (
        <div className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      ) : null}

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={handleSuggestReply}
          disabled={loading || aiLoading}
          className="rounded-2xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {aiLoading ? "ИИ думает..." : "Предложить ответ"}
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading || aiLoading}
          className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Отправляем..." : "Отправить"}
        </button>
      </div>
    </div>
  );
}