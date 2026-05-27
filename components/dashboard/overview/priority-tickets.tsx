import { ArrowUpRight } from "lucide-react";

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

export function PriorityTickets() {
  return (
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
  );
}