"use client";

import {
  Copy,
  Download,
  MessageCircle,
  Printer,
  X,
} from "lucide-react";

import type { ActionType } from "../types";

type ActionModalProps = {
  activeAction: ActionType;
  actionTitle: string;
  qrUrl: string;
  qrImageUrl: string;
  onClose: () => void;
  onCopy: () => void;
};

export default function ActionModal({
  activeAction,
  actionTitle,
  qrUrl,
  qrImageUrl,
  onClose,
  onCopy,
}: ActionModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[32px] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-5">
          <div>
            <div className="text-sm font-black text-emerald-600">
              Первый шаг
            </div>
            <h3 className="mt-2 text-3xl font-black">{actionTitle}</h3>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 transition hover:bg-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {activeAction === "cards" && (
          <div className="mt-6 space-y-4">
            <div className="rounded-3xl border border-black/[0.06] p-4">
              <div className="font-black">Формат</div>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {["A4 · 10 визиток", "A4 · 12 визиток", "PDF"].map((item) => (
                  <button
                    key={item}
                    className="rounded-2xl border border-black/[0.08] px-4 py-3 text-sm font-bold transition hover:border-emerald-400 hover:bg-emerald-50"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-black font-black text-white"
            >
              <Printer className="h-5 w-5" />
              Подготовить к печати
            </button>
          </div>
        )}

        {activeAction === "telegram" && (
          <div className="mt-6">
            <div className="rounded-3xl bg-zinc-50 p-5 text-sm leading-7 text-zinc-700">
              Здравствуйте! Теперь мне можно отправить обращение через ПУЛЬС.
              Просто откройте ссылку или отсканируйте QR-код:
              <br />
              <br />
              {qrUrl}
            </div>

            <button
              onClick={onCopy}
              className="mt-4 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-black font-black text-white"
            >
              <Copy className="h-5 w-5" />
              Скопировать ссылку
            </button>
          </div>
        )}

        {activeAction === "car" && (
          <div className="mt-6 space-y-4">
            <div className="rounded-3xl bg-zinc-50 p-5">
              <div className="font-black">Размер наклейки</div>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {["Маленькая", "Средняя", "Большая"].map((item) => (
                  <button
                    key={item}
                    className="rounded-2xl border border-black/[0.08] bg-white px-4 py-3 text-sm font-bold transition hover:border-emerald-400 hover:bg-emerald-50"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <a
              href={qrImageUrl}
              target="_blank"
              rel="noreferrer"
              className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-black font-black text-white"
            >
              <Download className="h-5 w-5" />
              Скачать QR для макета
            </a>
          </div>
        )}

        {activeAction === "clients" && (
          <div className="mt-6">
            <div className="rounded-3xl bg-zinc-50 p-5 text-sm leading-7 text-zinc-700">
              Добрый день! Теперь вы можете быстро оставить мне обращение через
              ПУЛЬС:
              <br />
              <br />
              {qrUrl}
            </div>

            <button
              onClick={onCopy}
              className="mt-4 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-black font-black text-white"
            >
              <MessageCircle className="h-5 w-5" />
              Скопировать сообщение
            </button>
          </div>
        )}
      </div>
    </div>
  );
}