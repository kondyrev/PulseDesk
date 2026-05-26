import { Bell } from "lucide-react";
import { Search } from "lucide-react";

export function Topbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.04] bg-[#f5f5f7]/80 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-6 lg:px-10">
        <div>
          <h1 className="text-2xl font-black tracking-tight">
            Обзор workspace
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            AI-first support operating system
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-zinc-600 shadow-sm transition hover:bg-zinc-50 hover:text-black">
            <Search className="h-5 w-5" />
          </button>

          <button className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-zinc-600 shadow-sm transition hover:bg-zinc-50 hover:text-black">
            <Bell className="h-5 w-5" />

            <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <button className="flex items-center gap-3 rounded-2xl bg-white px-4 py-2 shadow-sm transition hover:bg-zinc-50">
            <div className="h-10 w-10 rounded-full bg-zinc-200" />

            <div className="hidden text-left lg:block">
              <div className="text-sm font-semibold">
                Алексей
              </div>

              <div className="text-xs text-zinc-500">
                Founder
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}