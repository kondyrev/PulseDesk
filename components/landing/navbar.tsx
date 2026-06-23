export function Navbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-black/[0.04] bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <a href="#" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-sm font-bold text-white shadow-lg">
            P
          </div>

          <div>
            <div className="text-lg font-bold tracking-tight">Pulse</div>
            <div className="text-xs text-zinc-500">
              Заявки по QR-коду
            </div>
          </div>
        </a>

        <nav className="hidden items-center gap-10 text-sm font-medium text-zinc-500 md:flex">
          <a href="#how" className="transition hover:text-black">
            Как работает
          </a>
          <a href="#for" className="transition hover:text-black">
            Для кого
          </a>
          <a href="#pricing" className="transition hover:text-black">
            Тарифы
          </a>
          <a href="#faq" className="transition hover:text-black">
            Вопросы
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="/dashboard"
            className="hidden text-sm font-medium text-zinc-600 transition hover:text-black sm:block"
          >
            Войти
          </a>

          <a
            href="/dashboard"
            className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
          >
            Получить QR
          </a>
        </div>
      </div>
    </header>
  );
}
