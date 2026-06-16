export function Footer() {
  return (
    <footer className="border-t border-black/[0.05] bg-[#fafafa]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col justify-between gap-12 md:flex-row">
          <div className="max-w-md">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-sm font-bold text-white">
                P
              </div>

              <div>
                <div className="text-xl font-bold tracking-tight">
                  PulseDesk
                </div>

                <div className="text-sm text-zinc-500">
                  Рабочее пространство поддержки
                </div>
              </div>
            </div>

            <p className="leading-7 text-zinc-500">
              PulseDesk помогает командам поддержки работать спокойно,
              объединяя обращения, историю общения и возможности
              искусственного интеллекта в одном месте.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <div className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
                Продукт
              </div>

              <div className="space-y-3">
                <a
                  href="#features"
                  className="block text-zinc-600 transition hover:text-black"
                >
                  Возможности
                </a>

                <a
                  href="#pricing"
                  className="block text-zinc-600 transition hover:text-black"
                >
                  Тарифы
                </a>

                <a
                  href="#faq"
                  className="block text-zinc-600 transition hover:text-black"
                >
                  Вопросы
                </a>
              </div>
            </div>

            <div>
              <div className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
                Начало работы
              </div>

              <div className="space-y-3">
                <a
                  href="/dashboard"
                  className="block text-zinc-600 transition hover:text-black"
                >
                  Создать рабочее пространство
                </a>

                <a
                  href="/dashboard"
                  className="block text-zinc-600 transition hover:text-black"
                >
                  Войти
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-black/[0.05] pt-8 text-sm text-zinc-500 md:flex-row">
          <div>© 2026 PulseDesk. Все права защищены.</div>

          <div className="text-center md:text-right">
            Сделано для команд, которые ценят порядок, скорость и спокойную работу.
          </div>
        </div>
      </div>
    </footer>
  );
}