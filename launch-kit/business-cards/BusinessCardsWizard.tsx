"use client";

import { Eye, Palette, Printer } from "lucide-react";
import { useMemo, useState } from "react";

import type { BusinessCardData } from "./types";

type Props = {
  data: BusinessCardData;
};

type CardStyle = "light" | "contrast" | "classic";

const cardStyles: Array<{
  id: CardStyle;
  title: string;
  description: string;
}> = [
  {
    id: "light",
    title: "Спокойный",
    description: "Много воздуха, хорошо печатается дома.",
  },
  {
    id: "contrast",
    title: "Заметный",
    description: "Чёткий заголовок и сильный QR.",
  },
  {
    id: "classic",
    title: "Простой",
    description: "Похоже на обычную бумажную карточку.",
  },
];

function getCardClasses(style: CardStyle) {
  if (style === "contrast") {
    return {
      card: "border-zinc-950 bg-zinc-950 text-white",
      muted: "text-white/70",
      qrWrap: "bg-white",
      link: "text-white/70",
      divider: "border-white/15",
    };
  }

  if (style === "classic") {
    return {
      card: "border-zinc-300 bg-[#fffdf8] text-zinc-950",
      muted: "text-zinc-500",
      qrWrap: "bg-white",
      link: "text-zinc-500",
      divider: "border-zinc-300",
    };
  }

  return {
    card: "border-zinc-200 bg-white text-zinc-950",
    muted: "text-zinc-500",
    qrWrap: "bg-zinc-50",
    link: "text-zinc-500",
    divider: "border-zinc-200",
  };
}

function FirstClientCard({
  data,
  style,
}: {
  data: BusinessCardData;
  style: CardStyle;
}) {
  const classes = getCardClasses(style);

  return (
    <div
      className={[
        "flex h-[50mm] w-[90mm] flex-col justify-between rounded-[4mm] border p-[5mm]",
        classes.card,
      ].join(" ")}
    >
      <div>
        {data.displayName ? (
          <div className="truncate text-[15px] font-black leading-tight">
            {data.displayName}
          </div>
        ) : null}

        <div className="mt-[2mm] text-[11px] font-bold leading-tight">
          Я теперь в ПУЛЬСе
        </div>
      </div>

      <div className="flex items-end justify-between gap-[4mm]">
        <div className="min-w-0 flex-1">
          <div
            className={[
              "border-t pt-[3mm] text-[10px] font-bold leading-tight",
              classes.divider,
            ].join(" ")}
          >
            Напишите мне здесь
          </div>

          <div className={["mt-[2mm] truncate text-[7px]", classes.link].join(" ")}>
            {data.qrUrl}
          </div>
        </div>

        <div
          className={[
            "flex h-[24mm] w-[24mm] shrink-0 items-center justify-center rounded-[3mm] p-[1.5mm]",
            classes.qrWrap,
          ].join(" ")}
        >
          <img
            src={data.qrImageUrl}
            alt="QR-код для клиента"
            className="h-full w-full"
          />
        </div>
      </div>
    </div>
  );
}

export default function BusinessCardsWizard({ data }: Props) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [stylesOpen, setStylesOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<CardStyle>("light");

  const cards = useMemo(() => Array.from({ length: 10 }), []);
  const selectedStyleInfo = cardStyles.find((item) => item.id === selectedStyle);

  function printSheet() {
    window.print();
  }

  return (
    <div className="mt-6">
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }

          body * {
            visibility: hidden;
          }

          .pulse-a4-print-area,
          .pulse-a4-print-area * {
            visibility: visible;
          }

          .pulse-a4-print-area {
            position: fixed;
            inset: 0;
            margin: 0;
            box-shadow: none !important;
          }

          .pulse-a4-screen-only {
            display: none !important;
          }
        }
      `}</style>

      <div className="pulse-a4-screen-only mb-5 rounded-3xl bg-emerald-50 p-5">
        <div className="text-xl font-black">
          Подготовьтесь к первой встрече с клиентом
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
          Обычной бумаги A4 достаточно, чтобы начать. Распечатайте лист,
          разрежьте по линиям и возьмите несколько карточек с собой.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="overflow-auto rounded-[28px] border border-black/[0.06] bg-zinc-100 p-4">
          <div className="pulse-a4-print-area mx-auto min-h-[297mm] w-[210mm] bg-white p-[12mm] shadow-[0_18px_60px_rgba(0,0,0,0.12)]">
            <div className="grid grid-cols-2 gap-x-[6mm] gap-y-[5mm]">
              {cards.map((_, index) => (
                <div key={index} className="relative">
                  <FirstClientCard data={data} style={selectedStyle} />
                  <div className="pointer-events-none absolute -inset-[1.5mm] border border-dashed border-zinc-300" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="pulse-a4-screen-only space-y-3">
          <button
            onClick={printSheet}
            className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-black px-4 font-black text-white transition hover:opacity-90"
          >
            <Printer className="h-5 w-5" />
            Распечатать лист A4
          </button>

          <button
            onClick={() => setDetailsOpen((current) => !current)}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-black/[0.08] bg-white px-4 text-sm font-black transition hover:bg-zinc-50"
          >
            <Eye className="h-4 w-4" />
            Проверить текст
          </button>

          {detailsOpen && (
            <div className="rounded-3xl border border-black/[0.06] bg-white p-4 text-sm leading-6 text-zinc-600">
              {data.displayName ? (
                <div>
                  <span className="font-bold text-zinc-950">Имя:</span>{" "}
                  {data.displayName}
                </div>
              ) : null}
              <div>
                <span className="font-bold text-zinc-950">Текст:</span> Я
                теперь в ПУЛЬСе. Напишите мне здесь.
              </div>
              <div className="mt-2 break-all text-xs text-zinc-500">
                {data.qrUrl}
              </div>
            </div>
          )}

          <button
            onClick={() => setStylesOpen((current) => !current)}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-black/[0.08] bg-white px-4 text-sm font-black transition hover:bg-zinc-50"
          >
            <Palette className="h-4 w-4" />
            Выбрать другой вид
          </button>

          {stylesOpen && (
            <div className="rounded-3xl border border-black/[0.06] bg-white p-3">
              <div className="mb-2 px-1 text-xs font-bold text-zinc-400">
                Сейчас выбран: {selectedStyleInfo?.title}
              </div>

              <div className="space-y-2">
                {cardStyles.map((style) => {
                  const selected = style.id === selectedStyle;

                  return (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={[
                        "w-full rounded-2xl border px-4 py-3 text-left transition",
                        selected
                          ? "border-emerald-400 bg-emerald-50"
                          : "border-black/[0.06] hover:bg-zinc-50",
                      ].join(" ")}
                    >
                      <div className="text-sm font-black">{style.title}</div>
                      <div className="mt-1 text-xs leading-5 text-zinc-500">
                        {style.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
