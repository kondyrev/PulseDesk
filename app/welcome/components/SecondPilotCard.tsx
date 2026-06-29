"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

import type { PilotState } from "../types";

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

type SecondPilotCardProps = {
  pilotState: PilotState;
};

export default function SecondPilotCard({ pilotState }: SecondPilotCardProps) {
  return (
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
            {["понять вопрос клиента", "предложить готовый ответ"].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm text-white/75"
                >
                  <Check className="h-4 w-4 rounded-full border border-emerald-400/40 bg-emerald-400/10 p-0.5 text-emerald-300" />
                  {item}
                </div>
              ),
            )}
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
  );
}