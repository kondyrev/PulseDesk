import { DashboardPreview } from "./dashboard-preview";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-[#f5f5f7]" />
      <div className="absolute left-0 top-0 h-[640px] w-[640px] rounded-full bg-sky-200/25 blur-3xl" />
      <div className="absolute right-0 top-0 h-[640px] w-[640px] rounded-full bg-violet-200/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-28 pt-40">
        <div className="grid items-center gap-16 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-black/[0.04] bg-white px-5 py-3 text-sm text-zinc-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Для мастеров, самозанятых и небольших команд
            </div>

            <h1 className="mb-8 text-6xl font-black leading-[0.92] tracking-[-0.06em] md:text-8xl">
              Заявки
              <br />
              от клиентов
              <br />
              по QR-коду.
            </h1>

            <p className="mb-12 max-w-2xl text-xl font-medium leading-relaxed text-zinc-500 md:text-2xl">
              Pulse помогает принимать обращения без сайта, CRM и сложных
              настроек. Клиент сканирует QR, выбирает куда прислать ссылку на
              диалог, пишет сообщение и прикрепляет фото.
            </p>

            <div className="mb-8 flex flex-col gap-5 sm:flex-row">
              <a
                href="/dashboard"
                className="rounded-3xl bg-black px-8 py-5 text-center text-base font-semibold text-white shadow-2xl transition hover:opacity-90"
              >
                Получить свой QR-код
              </a>

              <a
                href="#how"
                className="rounded-3xl border border-black/5 bg-white px-8 py-5 text-center text-base font-semibold text-black transition hover:bg-zinc-50"
              >
                Посмотреть, как работает
              </a>
            </div>

            <div className="text-sm font-medium text-zinc-400">
              Бесплатный старт · без приложения для клиента · работает с телефона
            </div>
          </div>

          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}
