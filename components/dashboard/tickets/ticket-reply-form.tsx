"use client";

import { useState } from "react";

export function TicketReplyForm({
  ticketId,
  isClosed,
}: {
  ticketId: string;
  isClosed: boolean;
}) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (isClosed) return;

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

    window.dispatchEvent(
      new CustomEvent("pulsedesk:messages-updated", {
        detail: {
          ticketId,
        },
      })
    );
  }

  if (isClosed) {
    return (
      <div className="rounded-[32px] border border-emerald-200 bg-emerald-50 p-6">
        <div className="text-sm font-semibold text-emerald-700">
          ✓ Обращение закрыто
        </div>

        <p className="mt-2 text-sm text-emerald-600">
          Новые ответы оператора недоступны.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[32px] border border-black/5 bg-[#f6f7f8] p-4">
      <textarea
        value={content}
        onChange={(event) => {
          setContent(event.target.value);
          setError("");
        }}
        placeholder="Напишите ответ клиенту..."
        disabled={loading}
        className="h-32 w-full resize-none bg-transparent text-sm outline-none disabled:cursor-wait disabled:opacity-60"
      />

      {error ? (
        <div className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      ) : null}

      <div className="mt-4 flex items-center justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Отправляем..." : "Отправить"}
        </button>
      </div>
    </div>
  );
}