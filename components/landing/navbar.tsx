export function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-black/[0.04]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-sm shadow-lg">
            P
          </div>

          <div>
            <div className="font-bold tracking-tight text-lg">PulseDesk</div>
            <div className="text-xs text-zinc-500">
              AI-first support platform
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-10 text-sm text-zinc-500 font-medium">
          <a href="#pain" className="hover:text-black transition">
            Проблемы
          </a>
          <a href="#features" className="hover:text-black transition">
            Возможности
          </a>
          <a href="#pricing" className="hover:text-black transition">
            Тарифы
          </a>
          <a href="#faq" className="hover:text-black transition">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="hidden sm:block text-sm font-medium text-zinc-600 hover:text-black transition">
            Войти
          </button>

          <button className="px-5 py-3 rounded-2xl bg-black text-white text-sm font-semibold hover:opacity-90 transition shadow-lg">
            Попробовать бесплатно
          </button>
        </div>
      </div>
    </header>
  );
}