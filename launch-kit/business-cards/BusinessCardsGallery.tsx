"use client";

import { Check } from "lucide-react";

import type { BusinessCardTemplate } from "./types";

type Props = {
  templates: BusinessCardTemplate[];
  selectedTemplateId: string;
  onSelect: (templateId: string) => void;
};

export default function BusinessCardsGallery({
  templates,
  selectedTemplateId,
  onSelect,
}: Props) {
  return (
    <div className="rounded-3xl border border-black/[0.06] p-4">
      <div className="font-black">Оформление</div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {templates.map((template) => {
          const selected = template.id === selectedTemplateId;

          return (
            <button
              key={template.id}
              onClick={() => onSelect(template.id)}
              className={[
                "relative rounded-2xl border p-4 text-left transition",
                selected
                  ? "border-emerald-400 bg-emerald-50"
                  : "border-black/[0.08] hover:border-emerald-300 hover:bg-emerald-50/60",
              ].join(" ")}
            >
              {selected && (
                <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <Check className="h-4 w-4" />
                </div>
              )}

              <div className="text-sm font-black">{template.title}</div>
              <div className="mt-1 text-xs leading-5 text-zinc-500">
                {template.subtitle}
              </div>

              {template.id === "modern" && (
                <div className="mt-3 inline-flex rounded-full bg-black px-2.5 py-1 text-[10px] font-black text-white">
                  Рекомендуем
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}