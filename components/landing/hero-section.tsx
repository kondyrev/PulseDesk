import { DashboardPreview } from "./dashboard-preview";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-[#f5f5f7]" />
      <div className="absolute top-0 left-0 w-[640px] h-[640px] bg-blue-200/30 blur-3xl rounded-full" />
      <div className="absolute top-0 right-0 w-[640px] h-[640px] bg-violet-200/30 blur-3xl rounded-full" />

      <div className="max-w-7xl mx-auto px-6 pt-40 pb-28 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-black/[0.04] shadow-sm text-sm text-zinc-600 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            AI-платформа поддержки нового поколения
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-[-0.06em] leading-[0.92] mb-8">
            Поддержка клиентов,
            <br />
            которая думает
            <br />
            вместе с вами.
          </h1>

          <p className="text-xl md:text-2xl text-zinc-500 leading-relaxed max-w-3xl mx-auto mb-12 font-medium">
            PulseDesk объединяет AI, realtime-работу команды и современный UX
            в единую платформу поддержки для SaaS и digital-команд.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5 mb-20">
            <button className="px-8 py-5 rounded-3xl bg-black text-white text-base font-semibold hover:opacity-90 transition shadow-2xl">
              Начать бесплатно
            </button>

            <button className="px-8 py-5 rounded-3xl bg-white text-black text-base font-semibold border border-black/5 hover:bg-zinc-50 transition">
              Смотреть демо
            </button>
          </div>
        </div>

        <DashboardPreview />
      </div>
    </section>
  );
}