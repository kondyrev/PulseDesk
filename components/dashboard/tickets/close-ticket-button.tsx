"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CloseTicketButton({
  ticketId,
  isClosed,
}: {
  ticketId: string;
  isClosed: boolean;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleClose() {
    if (isClosed) return;

    const confirmed = window.confirm(
      "Закрыть обращение?"
    );

    if (!confirmed) return;

    setLoading(true);

    const response = await fetch(
      `/api/tickets/${ticketId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "closed",
        }),
      }
    );

    setLoading(false);

    if (!response.ok) {
      alert("Не удалось закрыть обращение.");
      return;
    }

    router.refresh();
  }

  return (
    <button
      onClick={handleClose}
      disabled={loading || isClosed}
      className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
    >
      {isClosed
        ? "Обращение закрыто"
        : loading
          ? "Закрываем..."
          : "Закрыть обращение"}
    </button>
  );
}