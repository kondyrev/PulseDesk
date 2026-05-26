import {
  AlertTriangle,
  ArrowUpRight,
  Clock,
  MessageSquare,
  Sparkles,
  Ticket,
  Users,
} from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";

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

const tickets = [
  {
    title: "Клиента списали дважды после обновления подписки",
    customer: "Анна Смирнова",
    status: "Высокий приоритет",
    tone: "Раздражен",
    time: "2 мин назад",
  },
  {
    title: "Не приходит письмо для восстановления пароля",
    customer: "Илья Морозов",
    status: "Средний приоритет",
    tone: "Нейтрально",
    time: "14 мин назад",
  },
  {
    title: "Нужна интеграция с Telegram уведомлениями",
    customer: "Digital Flow",
    status: "Feature request",
    tone: "Позитивно",
    time: "31 мин назад",
  },
];

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <section className="rounded-[36px] border border-black/[0.04] bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Workspace в норме
              </div>

              <h2 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.05em]">
                Сегодня AI помогает команде держать поддержку под контролем.
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-500">
                PulseDesk анализирует входящие обращения, подсвечивает срочные
                тикеты и помогает операторам отвечать быстрее.
              </p>
            </div>

            <button className="flex items-center justify-center gap-2 rounded-3xl bg-black px-6 py-4 text-sm font-semibold text-white shadow-lg transition hover:opacity-90">
              Открыть входящие
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </section>

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

                  <div className="text-sm text-zinc-400">{stat.change}</div>
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

        <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <div className="rounded-[36px] border border-black/[0.04] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-black/[0.04] p-6">
              <div>
                <h3 className="text-xl font-bold tracking-tight">
                  Приоритетные обращения
                </h3>

                <p className="mt-1 text-sm text-zinc-500">
                  AI отсортировал тикеты по срочности и риску эскалации.
                </p>
              </div>

              <button className="rounded-2xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-200">
                Все тикеты
              </button>
            </div>

            <div className="divide-y divide-black/[0.04]">
              {tickets.map((ticket) => (
                <div
                  key={ticket.title}
                  className="flex flex-col gap-5 p-6 transition hover:bg-zinc-50 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div>
                    <div className="mb-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">
                        {ticket.status}
                      </span>

                      <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-500">
                        {ticket.tone}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold tracking-tight">
                      {ticket.title}
                    </h4>

                    <p className="mt-2 text-sm text-zinc-500">
                      {ticket.customer} · {ticket.time}
                    </p>
                  </div>

                  <button className="flex items-center justify-center gap-2 rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90">
                    Открыть
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[36px] border border-black/[0.04] bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-bold tracking-tight">
                  AI Copilot
                </h3>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                  Онлайн
                </span>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
                    Summary дня
                  </div>

                  <p className="leading-relaxed text-zinc-600">
                    Основной рост обращений связан с оплатой и восстановлением
                    доступа. 7 клиентов требуют быстрого ответа.
                  </p>
                </div>

                <div className="rounded-3xl bg-zinc-100 p-5">
                  <div className="mb-2 text-sm font-semibold">
                    Рекомендуемое действие
                  </div>

                  <p className="text-sm leading-relaxed text-zinc-500">
                    Назначить billing-тикеты на старшего оператора и подготовить
                    шаблон ответа по двойным списаниям.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[36px] border border-black/[0.04] bg-black p-6 text-white shadow-2xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <MessageSquare className="h-5 w-5" />
              </div>

              <h3 className="mb-3 text-2xl font-black tracking-tight">
                Команда отвечает быстрее.
              </h3>

              <p className="leading-relaxed text-zinc-400">
                AI summary и suggested replies сокращают ручную работу и
                помогают сохранить качество общения.
              </p>
            </div>
          </aside>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[36px] border border-black/[0.04] bg-white p-6 shadow-sm lg:col-span-2">
            <h3 className="mb-6 text-xl font-bold tracking-tight">
              Активность команды
            </h3>

            <div className="space-y-5">
              {[
                "Мария закрыла тикет по оплате с AI-подсказкой",
                "AI отметил 3 обращения как высокий риск эскалации",
                "Алексей обновил статус workspace",
              ].map((item) => (
                <div key={item} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-zinc-100" />
                  <div className="text-sm text-zinc-600">{item}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[36px] border border-black/[0.04] bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100">
              <Users className="h-5 w-5" />
            </div>

            <div className="text-4xl font-black tracking-tight">8</div>

            <div className="mt-2 text-sm text-zinc-500">
              активных операторов сегодня
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}