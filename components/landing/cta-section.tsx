export function CtaSection() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="overflow-hidden rounded-[48px] bg-black px-8 py-16 text-center text-white shadow-2xl md:px-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 text-sm font-semibold uppercase tracking-[0.3em] text-white/50">
              PulseDesk
            </div>

            <h2 className="mb-8 text-4xl font-black tracking-tight md:text-6xl">
              Пусть поддержка
              <br />
              работает спокойно.
            </h2>

            <p className="mx-auto mb-12 max-w-2xl text-lg leading-8 text-white/70 md:text-xl">
              Объедините обращения, командную работу и возможности искусственного
              интеллекта в одном рабочем пространстве. Меньше хаоса — больше
              внимания клиентам.
            </p>

            <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
              <button className="rounded-3xl bg-white px-8 py-5 text-base font-semibold text-black transition hover:opacity-90">
                Начать бесплатно
              </button>

              <button className="rounded-3xl border border-white/15 bg-white/10 px-8 py-5 text-base font-semibold text-white backdrop-blur transition hover:bg-white/15">
                Посмотреть возможности
              </button>
            </div>

            <div className="mt-12 text-sm text-white/50">
              Без сложного внедрения. Подключение занимает всего несколько минут.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}