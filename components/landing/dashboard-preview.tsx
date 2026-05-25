function TicketPreview({
  labels,
  title,
  summary,
  time,
  dot,
}: {
  labels: [string, string][];
  title: string;
  summary: string;
  time: string;
  dot: string;
}) {
  return (
    <div className="p-6 hover:bg-zinc-50 transition cursor-pointer">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap mb-4">
            {labels.map(([label, className]) => (
              <span
                key={label}
                className={`px-3 py-1 rounded-full text-xs font-semibold ${className}`}
              >
                {label}
              </span>
            ))}
          </div>

          <h3 className="font-semibold text-xl mb-3 tracking-tight">{title}</h3>

          <p className="text-zinc-500 leading-relaxed max-w-2xl">
            AI summary: {summary}
          </p>
        </div>

        <div className="text-right">
          <div className="text-sm text-zinc-400 mb-3">{time}</div>
          <div className={`w-3 h-3 rounded-full ml-auto ${dot}`} />
        </div>
      </div>
    </div>
  );
}

function Insight({
  title,
  value,
  danger,
}: {
  title: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-zinc-400 mb-2">
        {title}
      </div>

      <div
        className={
          danger
            ? "font-semibold text-red-500"
            : "text-zinc-600 leading-relaxed text-sm"
        }
      >
        {value}
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  width,
}: {
  label: string;
  value: string;
  width: string;
}) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-center justify-between mb-2 text-sm">
        <span className="text-zinc-500">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>

      <div className="h-2 rounded-full bg-zinc-200 overflow-hidden">
        <div className="h-full bg-black rounded-full" style={{ width }} />
      </div>
    </div>
  );
}

export function DashboardPreview() {
  return (
    <div className="max-w-6xl mx-auto rounded-[40px] overflow-hidden bg-white border border-black/[0.04] shadow-[0_50px_100px_rgba(0,0,0,0.08)]">
      <div className="h-16 border-b border-black/[0.04] bg-white flex items-center px-6 gap-2">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-yellow-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
      </div>

      <div className="grid lg:grid-cols-[260px_1fr_340px] min-h-[700px] bg-[#fafafa]">
        <aside className="bg-white border-r border-black/[0.04] p-5 hidden lg:block">
          <div className="space-y-2">
            {["Дашборд", "Входящие", "Тикеты", "Аналитика", "AI Copilot"].map(
              (item, index) => (
                <div
                  key={item}
                  className={
                    index === 0
                      ? "px-4 py-3 rounded-2xl bg-black text-white font-medium text-sm"
                      : "px-4 py-3 rounded-2xl text-zinc-500 hover:bg-zinc-100 transition text-sm"
                  }
                >
                  {item}
                </div>
              )
            )}
          </div>

          <div className="mt-10 bg-white border border-black/[0.04] rounded-3xl p-6 shadow-sm">
            <div className="text-sm text-zinc-400 mb-5 font-medium">
              Эффективность команды
            </div>

            <div className="space-y-6">
              <div>
                <div className="text-4xl font-black tracking-tight">94%</div>
                <div className="text-zinc-500 text-sm mt-1">
                  Ответов с AI-помощью
                </div>
              </div>

              <div>
                <div className="text-4xl font-black tracking-tight">-63%</div>
                <div className="text-zinc-500 text-sm mt-1">
                  Быстрее закрытие тикетов
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="border-r border-black/[0.04] bg-white">
          <div className="h-16 border-b border-black/[0.04] px-6 flex items-center justify-between">
            <h2 className="font-semibold text-lg">Приоритетные тикеты</h2>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-zinc-100 text-sm text-zinc-500">
                Фильтр
              </div>

              <div className="px-4 py-2 rounded-xl bg-zinc-100 text-sm text-zinc-500">
                Поиск
              </div>
            </div>
          </div>

          <div className="divide-y divide-black/[0.04]">
            <TicketPreview
              labels={[
                ["Недовольный клиент", "bg-red-100 text-red-600"],
                ["Оплата", "bg-orange-100 text-orange-600"],
                ["Высокий приоритет", "bg-blue-100 text-blue-600"],
              ]}
              title="Клиента списали дважды после обновления подписки"
              summary="Пользователь сообщает о двойном списании после апгрейда тарифа. Клиент уже обращался в поддержку 3 раза."
              time="2 мин назад"
              dot="bg-red-500"
            />

            <TicketPreview
              labels={[
                ["AI классифицировал", "bg-emerald-100 text-emerald-600"],
                ["Feature request", "bg-violet-100 text-violet-600"],
              ]}
              title="Добавить интеграцию со Slack для уведомлений"
              summary="Клиент просит интеграцию со Slack для realtime-уведомлений и командной работы."
              time="12 мин назад"
              dot="bg-emerald-500"
            />
          </div>
        </main>

        <aside className="bg-[#fafafa] p-5 hidden lg:block">
          <div className="bg-white border border-black/[0.04] rounded-[32px] p-6 mb-5 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg">AI Copilot</h3>
              <span className="text-emerald-600 text-sm font-medium">
                Онлайн
              </span>
            </div>

            <div className="space-y-6">
              <Insight
                title="Тональность"
                value="Раздражен / высокая срочность"
                danger
              />

              <Insight
                title="Рекомендуемое действие"
                value="Передать тикет billing-специалисту и предложить проверку возврата средств."
              />

              <div>
                <div className="text-xs uppercase tracking-wide text-zinc-400 mb-2">
                  Предлагаемый ответ
                </div>

                <div className="rounded-2xl bg-zinc-100 p-4 text-sm text-zinc-600 leading-relaxed">
                  Здравствуйте! Извиняемся за задержку и неудобства. Мы уже
                  проверяем двойное списание и скоро сообщим результат.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/[0.04] rounded-[32px] p-6 shadow-sm">
            <div className="text-sm text-zinc-400 mb-6 font-medium">
              Сегодня
            </div>

            <Metric label="Среднее время ответа" value="4 мин" width="82%" />
            <Metric label="Решено сегодня" value="128" width="74%" />
          </div>
        </aside>
      </div>
    </div>
  );
}