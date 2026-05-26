import { LayoutDashboard } from "lucide-react";
import { Inbox } from "lucide-react";
import { Ticket } from "lucide-react";
import { BarChart3 } from "lucide-react";
import { Sparkles } from "lucide-react";
import { Settings } from "lucide-react";

const items = [
  {
    title: "Обзор",
    icon: LayoutDashboard,
    active: true,
  },
  {
    title: "Входящие",
    icon: Inbox,
  },
  {
    title: "Тикеты",
    icon: Ticket,
  },
  {
    title: "Аналитика",
    icon: BarChart3,
  },
  {
    title: "AI Copilot",
    icon: Sparkles,
  },
  {
    title: "Настройки",
    icon: Settings,
  },
];

export function DashboardSidebar() {
  return (
    <aside className="hidden w-[280px] border-r border-black/[0.04] bg-white lg:flex lg:flex-col">
      <div className="flex h-20 items-center border-b border-black/[0.04] px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-sm font-bold text-white shadow-lg">
            P
          </div>

          <div>
            <div className="font-bold tracking-tight">
              PulseDesk
            </div>

            <div className="text-xs text-zinc-500">
              AI workspace
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.title}
                className={
                  item.active
                    ? "flex w-full items-center gap-3 rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white"
                    : "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-black"
                }
              >
                <Icon className="h-5 w-5" />

                {item.title}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-black/[0.04] p-4">
        <div className="rounded-3xl border border-black/[0.04] bg-[#fafafa] p-5">
          <div className="mb-3 text-sm font-medium text-zinc-400">
            AI productivity
          </div>

          <div className="mb-1 text-4xl font-black tracking-tight">
            +43%
          </div>

          <div className="text-sm leading-relaxed text-zinc-500">
            быстрее обработка тикетов с AI Copilot
          </div>
        </div>
      </div>
    </aside>
  );
}