export function CtaSection() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="overflow-hidden rounded-[48px] bg-black px-8 py-16 text-center text-white shadow-2xl md:px-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 text-sm font-semibold uppercase tracking-[0.3em] text-white/50">
              Pulse
            </div>

            <h2 className="mb-8 text-4xl font-black tracking-tight md:text-6xl">
              Клиенты уже готовы
              <br />
              написать вам.
            </h2>

            <p className="mx-auto mb-12 max-w-2xl text-lg leading-8 text-white/70 md:text-xl">
              Дайте им простой способ связаться: QR-код, цифровая страница и
              диалог, который не потеряется.
            </p>

            <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
              <a
                href="/dashboard"
                className="rounded-3xl bg-white px-8 py-5 text-base font-semibold text-black transition hover:opacity-90"
              >
                Получить QR-код бесплатно
              </a>

              <a
                href="#how"
                className="rounded-3xl border border-white/15 bg-white/10 px-8 py-5 text-base font-semibold text-white backdrop-blur transition hover:bg-white/15"
              >
                Как это работает
              </a>
            </div>

            <div className="mt-12 text-sm text-white/50">
              Без сайта. Без сложной настройки. Без приложения для клиента.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
