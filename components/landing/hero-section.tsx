import { DashboardPreview } from "./dashboard-preview";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-[#f5f5f7]" />
      <div className="absolute left-0 top-0 h-[640px] w-[640px] rounded-full bg-blue-200/25 blur-3xl" />
      <div className="absolute right-0 top-0 h-[640px] w-[640px] rounded-full bg-violet-200/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-28 pt-40">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-black/[0.04] bg-white px-5 py-3 text-sm text-zinc-600 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            ИИ-рабочее пространство для поддержки клиентов
          </div>

          <h1 className="mb-8 text-6xl font-black leading-[0.92] tracking-[-0.06em] md:text-8xl">
            Поддержка,
            <br />
            в которой всё
            <br />
            под контролем.
          </h1>

          <p className="mx-auto mb-12 max-w-3xl text-xl font-medium leading-relaxed text-zinc-500 md:text-2xl">
            PulseDesk собирает обращения, контекст, командную работу и
            ИИ-помощника в одно спокойное рабочее пространство — чтобы оператор
            видел главное и отвечал быстрее.
          </p>

          <div className="mb-20 flex flex-col justify-center gap-5 sm:flex-row">
            <button className="rounded-3xl bg-black px-8 py-5 text-base font-semibold text-white shadow-2xl transition hover:opacity-90">
              Попробовать PulseDesk
            </button>

            <button className="rounded-3xl border border-black/5 bg-white px-8 py-5 text-base font-semibold text-black transition hover:bg-zinc-50">
              Посмотреть интерфейс
            </button>
          </div>
        </div>

        <DashboardPreview />
      </div>
    </section>
  );
}