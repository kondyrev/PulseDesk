"use client";

import { ChevronRight, Sparkles } from "lucide-react";

import { firstSteps } from "../data";
import type { ActionType } from "../types";

type FirstStepsProps = {
  onAction: (action: ActionType) => void;
};

export default function FirstSteps({ onAction }: FirstStepsProps) {
  return (
    <>
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white text-black">
          <Sparkles className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-3xl font-black tracking-tight">
            Ваши первые шаги
          </h2>
          <p className="mt-1 text-sm leading-5 text-white/55">
            Выберите, как вам удобнее рассказать о себе первым клиентам.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {firstSteps.map((step) => {
          const Icon = step.icon;

          return (
            <button
              key={step.number}
              onClick={() => onAction(step.action)}
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
    </>
  );
}
