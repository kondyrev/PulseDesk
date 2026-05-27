import {
  AlertTriangle,
  Clock,
  Sparkles,
  Ticket,
} from "lucide-react";

const stats = [
  {
    title: "Открытые тикеты",
    value: "42",
    change: "+12% за неделю",
    icon: Ticket,
  },
  {
    title: "Среднее время ответа",
    value: "4 мин",
    change: "-38% благодаря AI",
    icon: Clock,
  },
  {
    title: "AI assisted replies",
    value: "94%",
    change: "+18% за месяц",
    icon: Sparkles,
  },
  {
    title: "Недовольные клиенты",
    value: "7",
    change: "требуют внимания",
    icon: AlertTriangle,
  },
];

export function StatsGrid() {
  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-[32px] border border-black/[0.04] bg-white p-6 shadow-sm"
          >
            <div className="mb-8 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
                <Icon className="h-5 w-5" />
              </div>

              <div className="text-sm text-zinc-400">
                {stat.change}
              </div>
            </div>

            <div className="text-sm font-medium text-zinc-500">
              {stat.title}
            </div>

            <div className="mt-2 text-4xl font-black tracking-tight">
              {stat.value}
            </div>
          </div>
        );
      })}
    </section>
  );
}