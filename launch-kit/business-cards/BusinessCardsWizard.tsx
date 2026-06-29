"use client";

import { useMemo, useState } from "react";
import { Printer } from "lucide-react";

import { businessCardTemplates } from "./registry";
import BusinessCardsGallery from "./BusinessCardsGallery";

export default function BusinessCardsWizard() {
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    businessCardTemplates[0]?.id || "modern",
  );

  const selectedTemplate = useMemo(() => {
    return (
      businessCardTemplates.find(
        (template) => template.id === selectedTemplateId,
      ) || businessCardTemplates[0]
    );
  }, [selectedTemplateId]);

  return (
    <div className="mt-6 space-y-4">
      <BusinessCardsGallery
        templates={businessCardTemplates}
        selectedTemplateId={selectedTemplateId}
        onSelect={setSelectedTemplateId}
      />

      {selectedTemplate && (
        <div className="rounded-3xl bg-zinc-50 p-4">
          <div className="text-sm font-black">
            {selectedTemplate.title}
          </div>

          <p className="mt-2 text-sm leading-6 text-zinc-600">
            {selectedTemplate.description}
          </p>
        </div>
      )}

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
  );
}