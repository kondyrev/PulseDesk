"use client";

import { useState } from "react";
import { ArrowRight, Check, Heart, Sparkles } from "lucide-react";

import ProfessionSelect from "./ProfessionSelect";

export default function FirstLaunchForm() {
  const [profession, setProfession] = useState("");
  const [customProfession, setCustomProfession] = useState("");

  return (
    <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-[1fr_360px]">
      <div className="w-full max-w-3xl">
        <div className="mb-10">
          <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
            Первый запуск
          </div>

          <h1 className="mt-4 text-4xl font-black tracking-tight">
            Настроим ПУЛЬС под вас
          </h1>

          <p className="mt-4 max-w-xl text-lg leading-8 text-zinc-600">
            Это займёт меньше минуты. После этого ПУЛЬС подготовит ваш QR,
            первую визитку и рабочее пространство.
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Как к вам обращаться?
            </label>

            <input
              className="h-12 w-full rounded-2xl border border-zinc-200 px-4 outline-none transition focus:border-black"
              placeholder="Например: Владимир"
            />
          </div>

          <ProfessionSelect
            value={profession}
            customValue={customProfession}
            onChange={setProfession}
            onCustomChange={setCustomProfession}
          />

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Как называется ваше дело?
              <span className="ml-2 text-zinc-400">(необязательно)</span>
            </label>

            <input
              className="h-12 w-full rounded-2xl border border-zinc-200 px-4 outline-none transition focus:border-black"
              placeholder="Например: Владимир Сантехник"
            />
          </div>
        </div>

        <button className="mt-10 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-black text-lg font-bold text-white transition hover:opacity-90">
          Продолжить
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      <aside className="hidden rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.06)] lg:block">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <Sparkles className="h-6 w-6" />
        </div>

        <h2 className="mt-8 text-xl font-black">
          ПУЛЬС уже помогает мастерам
        </h2>

        <div className="mt-6 space-y-4">
          {[
            "Быстро отвечать клиентам",
            "Получать больше обращений",
            "Выглядеть профессионально",
            "Развивать своё дело",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm">
              <Check className="h-4 w-4 text-emerald-500" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-zinc-100 pt-6 text-sm text-zinc-500">
          Вы не одни — ПУЛЬС рядом
          <Heart className="ml-2 inline h-4 w-4 text-emerald-500" />
        </div>
      </aside>
    </div>
  );
}