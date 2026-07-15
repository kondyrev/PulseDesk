"use client";

import Link from "next/link";
import {
  ArrowRight,
  Copy,
  Download,
  Heart,
  QrCode,
  Sparkles,
} from "lucide-react";

type WelcomeQrCardProps = {
  qrUrl: string;
  qrImageUrl: string;
  copied: boolean;
  onCopy: () => void;
};

export default function WelcomeQrCard({
  qrImageUrl,
  copied,
  onCopy,
}: WelcomeQrCardProps) {
  return (
    <section className="flex min-h-0 flex-col rounded-[34px] border border-black/[0.04] bg-white px-8 py-7 shadow-sm">
      <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700">
        <Sparkles className="h-4 w-4" />
        Поздравляем!
      </div>

      <h1 className="mt-5 max-w-2xl text-5xl font-black leading-[1.02] tracking-tight">
        Ваш ПУЛЬС готов.
        <br />
        Покажите его <span className="text-emerald-500">первым клиентам.</span>
      </h1>

      <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-500">
        Покажите QR или отправьте ссылку клиенту — и он сможет написать вам в
        один клик.
      </p>

      <div className="mt-5 flex min-h-0 flex-1 flex-col rounded-[28px] border border-black/[0.06] bg-[#f8f8fa] p-4">
        <div className="flex flex-1 items-center justify-center rounded-[24px] bg-white p-4 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
          <img
            src={qrImageUrl}
            alt="Персональный QR-код ПУЛЬС"
            className="max-h-[255px] w-auto rounded-3xl"
          />
        </div>

        <div className="mt-3 flex items-center justify-center gap-2 text-center text-xs font-medium text-zinc-500">
          <QrCode className="h-4 w-4" />
          <span>
            Клиент наведёт камеру
            <br />и сможет написать вам.
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <a
          href={qrImageUrl}
          target="_blank"
          rel="noreferrer"
          className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-black px-4 text-sm font-black text-white shadow-xl shadow-black/10 transition hover:opacity-90"
        >
          <Download className="h-4 w-4" />
          Скачать QR
        </a>

        <button
          onClick={onCopy}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-black/[0.08] bg-white px-4 text-sm font-black transition hover:bg-zinc-50"
        >
          <Copy className="h-4 w-4" />
          {copied ? "Скопировано" : "Скопировать ссылку"}
        </button>

        <Link
          href="/dashboard"
          className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-black/[0.08] bg-white px-4 text-sm font-black transition hover:bg-zinc-50"
        >
          Начать работу
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-4 rounded-[22px] border border-emerald-100 bg-emerald-50/70 p-4">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-500 shadow-sm">
            <Heart className="h-5 w-5 fill-emerald-500/15" />
          </div>

          <div>
            <div className="font-black">
              Первый шаг уже сделан.
            </div>
            <p className="mt-1 text-sm leading-6 text-zinc-600">
              Расскажите клиентам, что вы теперь в ПУЛЬСе — и ждите первые
              сообщения.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
