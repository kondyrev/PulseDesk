import { ArrowUpRight } from "lucide-react";

export function OverviewHero() {
  return (
    <section className="rounded-[36px] border border-black/[0.04] bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Workspace в норме
          </div>

          <h2 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.05em]">
            Сегодня AI помогает команде держать поддержку под контролем.
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-500">
            PulseDesk анализирует входящие обращения, подсвечивает срочные
            тикеты и помогает операторам отвечать быстрее.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-3xl bg-black px-6 py-4 text-sm font-semibold text-white shadow-lg transition hover:opacity-90">
          Открыть входящие
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}