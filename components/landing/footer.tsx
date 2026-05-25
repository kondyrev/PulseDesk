export function Footer() {
  return (
    <footer className="border-t border-black/[0.04] py-10 bg-white">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-sm">
            P
          </div>

          <div>
            <div className="font-bold tracking-tight">PulseDesk</div>
            <div className="text-sm text-zinc-500">
              AI-first платформа поддержки
            </div>
          </div>
        </div>

        <div className="text-sm text-zinc-500 text-center md:text-right">
          © 2026 PulseDesk. Создано для современных SaaS-команд.
        </div>
      </div>
    </footer>
  );
}