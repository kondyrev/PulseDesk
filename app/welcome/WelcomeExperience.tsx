"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Car,
  Check,
  ChevronRight,
  Copy,
  Download,
  Heart,
  MessageCircle,
  Printer,
  QrCode,
  Send,
  Sparkles,
  Users,
  X,
} from "lucide-react";

type ActionType = "cards" | "telegram" | "car" | "clients";

type WelcomeExperienceProps = {
  qrUrl: string;
  qrImageUrl: string;
};

type PilotState = {
  title: string;
  message: string;
};

const pilotMessages: Record<ActionType | "start", PilotState> = {
  start: {
    title: "Я уже здесь ✨",
    message:
      "QR-код готов. Давайте спокойно сделаем первые шаги, чтобы клиенты смогли связаться с вами уже сегодня.",
  },
  cards: {
    title: "Хороший первый шаг.",
    message:
      "Визитки отлично подходят для старта. Их можно распечатать даже на обычном принтере.",
  },
  telegram: {
    title: "Идём в мессенджеры.",
    message:
      "Я подготовил короткий текст. Его можно отправить клиентам или закрепить в профиле.",
  },
  car: {
    title: "QR на автомобиле — сильная идея.",
    message:
      "Клиент сможет быстро оставить обращение, даже если увидел вас по дороге или во дворе.",
  },
  clients: {
    title: "Начинаем с тех, кто уже вас знает.",
    message:
      "Постоянные клиенты часто первыми пробуют новый способ связи.",
  },
};

function TypingText({ text }: { text: string }) {
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    setVisibleText("");

    let index = 0;

    const interval = window.setInterval(() => {
      index += 1;
      setVisibleText(text.slice(0, index));

      if (index >= text.length) {
        window.clearInterval(interval);
      }
    }, 14);

    return () => window.clearInterval(interval);
  }, [text]);

  return (
    <p className="mt-2 min-h-[48px] text-sm leading-6 text-white/68">
      {visibleText}
      <span className="ml-1 inline-block h-4 w-1 animate-pulse rounded-full bg-emerald-300 align-[-2px]" />
    </p>
  );
}

export default function WelcomeExperience({
  qrUrl,
  qrImageUrl,
}: WelcomeExperienceProps) {
  const [activeAction, setActiveAction] = useState<ActionType | null>(null);
  const [pilotState, setPilotState] = useState<PilotState>(pilotMessages.start);
  const [copied, setCopied] = useState(false);

  const actionTitle = useMemo(() => {
    if (activeAction === "cards") return "Распечатать визитки";
    if (activeAction === "telegram") return "Добавить QR в Telegram";
    if (activeAction === "car") return "Разместить QR на автомобиле";
    if (activeAction === "clients") return "Отправить ссылку клиентам";
    return "";
  }, [activeAction]);

  async function copyQrUrl() {
    await navigator.clipboard.writeText(qrUrl);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1600);
  }

  function openAction(action: ActionType) {
    setActiveAction(action);
    setPilotState(pilotMessages[action]);
  }

  return (
    <main className="h-screen overflow-hidden bg-[#f4f5f7] px-4 py-4 text-black">
      <div className="mx-auto grid h-full max-w-7xl gap-5 lg:grid-cols-[1.03fr_0.97fr]">
        <section className="flex min-h-0 flex-col rounded-[34px] border border-black/[0.04] bg-white px-8 py-7 shadow-sm">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700">
            <Sparkles className="h-4 w-4" />
            Поздравляем!
          </div>

          <h1 className="mt-5 max-w-2xl text-5xl font-black leading-[1.02] tracking-tight">
            Теперь вы готовы{" "}
            <span className="text-emerald-500">принимать</span> обращения.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-500">
            Мы уже создали для вас персональный QR-код. Покажите его будущим
            клиентам — и первое обращение может прийти уже сегодня.
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
              Это ваша персональная ссылка для клиентов
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
              onClick={copyQrUrl}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-black/[0.08] bg-white px-4 text-sm font-black transition hover:bg-zinc-50"
            >
              <Copy className="h-4 w-4" />
              {copied ? "Скопировано" : "Копировать"}
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
                  Сегодня у вас появился первый инструмент
                </div>
                <p className="mt-1 text-sm leading-6 text-zinc-600">
                  Для общения с будущими клиентами. Используйте его — и ваше
                  дело начнёт двигаться вперёд.
                </p>
              </div>
            </div>
          </div>
        </section>

        <aside className="flex min-h-0 flex-col rounded-[34px] border border-white/10 bg-[#050607] px-7 py-7 text-white shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white text-black">
              <Sparkles className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-3xl font-black tracking-tight">
                Ваши первые шаги
              </h2>
              <p className="mt-1 text-sm leading-5 text-white/55">
                Нажмите на действие — Второй пилот поможет продолжить.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {[
              {
                action: "cards" as const,
                number: "1",
                icon: Printer,
                title: "Распечатайте визитки",
                text: "Выберите формат и стиль для печати.",
              },
              {
                action: "telegram" as const,
                number: "2",
                icon: Send,
                title: "Добавьте QR в Telegram",
                text: "Получите готовый текст для отправки.",
              },
              {
                action: "car" as const,
                number: "3",
                icon: Car,
                title: "Разместите QR на автомобиле",
                text: "Подготовьте макет наклейки.",
              },
              {
                action: "clients" as const,
                number: "4",
                icon: Users,
                title: "Отправьте ссылку клиентам",
                text: "Скопируйте короткое сообщение.",
              },
            ].map((step) => {
              const Icon = step.icon;

              return (
                <button
                  key={step.number}
                  onClick={() => openAction(step.action)}
                  className="group relative flex h-[86px] items-center gap-4 overflow-hidden rounded-[23px] border border-white/[0.06] bg-white/[0.06] p-4 text-left transition hover:border-emerald-400/60 hover:bg-white/[0.09]"
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-emerald-400" />

                  <div className="absolute -left-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400 text-xs font-black text-black shadow-lg shadow-emerald-400/20">
                    {step.number}
                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.08]">
                    <Icon className="h-5 w-5 text-white" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="font-black">{step.title}</div>
                    <div className="mt-1 text-sm leading-5 text-white/55">
                      {step.text}
                    </div>
                  </div>

                  <ChevronRight className="h-5 w-5 shrink-0 text-white/35 transition group-hover:translate-x-1 group-hover:text-emerald-300" />
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-[30px] border border-emerald-400/70 bg-white/[0.04] shadow-[0_0_50px_rgba(52,211,153,0.14)]">
            <div className="relative p-5">
              <div className="absolute inset-x-0 top-0 h-24 bg-emerald-400/10 blur-2xl" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-4 w-4">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-400" />
                    </span>

                    <div className="text-2xl font-black">Второй пилот</div>
                  </div>

                  <div className="mt-2 inline-flex rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-black text-emerald-300">
                    Онлайн
                  </div>
                </div>

                <div className="relative flex h-18 w-18 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_0_40px_rgba(52,211,153,0.35)]">
                  <div className="absolute inset-2 rounded-full bg-zinc-100" />
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#101214]">
                    <div className="absolute -left-3 top-4 h-6 w-4 rounded-l-full bg-zinc-300" />
                    <div className="absolute -right-3 top-4 h-6 w-4 rounded-r-full bg-zinc-300" />
                    <div className="flex gap-2">
                      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
                      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400 [animation-delay:200ms]" />
                    </div>
                    <div className="absolute bottom-3 h-1.5 w-5 rounded-full bg-emerald-400/80" />
                  </div>
                </div>
              </div>

              <div className="relative mt-4 rounded-[22px] border border-white/[0.06] bg-white/[0.08] p-4">
                <div className="font-black">{pilotState.title}</div>

                <TypingText text={pilotState.message} />

                <div className="mt-3 grid gap-2">
                  {[
                    "понять вопрос клиента",
                    "предложить готовый ответ",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm text-white/75"
                    >
                      <Check className="h-4 w-4 rounded-full border border-emerald-400/40 bg-emerald-400/10 p-0.5 text-emerald-300" />
                      {item}
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center gap-3 text-sm text-white/55">
                  <span>Печатаю</span>
                  <span className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {activeAction && (
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
                onClick={() => setActiveAction(null)}
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
                    {["A4 · 10 визиток", "A4 · 12 визиток", "PDF"].map(
                      (item) => (
                        <button
                          key={item}
                          className="rounded-2xl border border-black/[0.08] px-4 py-3 text-sm font-bold transition hover:border-emerald-400 hover:bg-emerald-50"
                        >
                          {item}
                        </button>
                      ),
                    )}
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
                  Здравствуйте! Теперь мне можно отправить обращение через
                  ПУЛЬС. Просто откройте ссылку или отсканируйте QR-код:
                  <br />
                  <br />
                  {qrUrl}
                </div>

                <button
                  onClick={copyQrUrl}
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
                  Добрый день! Теперь вы можете быстро оставить мне обращение
                  через ПУЛЬС:
                  <br />
                  <br />
                  {qrUrl}
                </div>

                <button
                  onClick={copyQrUrl}
                  className="mt-4 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-black font-black text-white"
                >
                  <MessageCircle className="h-5 w-5" />
                  Скопировать сообщение
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}