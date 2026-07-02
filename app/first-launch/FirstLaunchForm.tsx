"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

import ProfessionSelect from "./ProfessionSelect";

export default function FirstLaunchForm() {
  const [profession, setProfession] = useState("");

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-12">
      <div className="w-full">
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

          <ProfessionSelect value={profession} onChange={setProfession} />

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
    </div>
  );
}