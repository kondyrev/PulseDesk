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
    <div className="cursor-pointer p-6 transition hover:bg-zinc-50">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            {labels.map(([label, className]) => (
              <span
                key={label}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${className}`}
              >
                {label}
              </span>
            ))}
          </div>

          <h3 className="mb-3 text-xl font-semibold tracking-tight">
            {title}
          </h3>

          <p className="max-w-2xl leading-relaxed text-zinc-500">
            Кратко: {summary}
          </p>
        </div>

        <div className="text-right">
          <div className="mb-3 text-sm text-zinc-400">{time}</div>
          <div className={`ml-auto h-3 w-3 rounded-full ${dot}`} />
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
      <div className="mb-2 text-xs uppercase tracking-wide text-zinc-400">
        {title}
      </div>

      <div
        className={
          danger
            ? "font-semibold text-red-500"
            : "text-sm leading-relaxed text-zinc-600"
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
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-zinc-500">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-zinc-200">
        <div className="h-full rounded-full bg-black" style={{ width }} />
      </div>
    </div>
  );
}

export function DashboardPreview() {
  return (
    <div className="mx-auto max-w-6xl overflow-hidden rounded-[40px] border border-black/[0.04] bg-white shadow-[0_50px_100px_rgba(0,0,0,0.08)]">
      <div className="flex h-16 items-center gap-2 border-b border-black/[0.04] bg-white px-6">
        <div className="h-3 w-3 rounded-full bg-red-400" />
        <div className="h-3 w-3 rounded-full bg-yellow-400" />
        <div className="h-3 w-3 rounded-full bg-green-400" />
      </div>

      <div className="grid min-h-[700px] bg-[#fafafa] lg:grid-cols-[260px_1fr_340px]">
        <aside className="hidden border-r border-black/[0.04] bg-white p-5 lg:block">
          <div className="space-y-2">
            {[
              "Рабочее пространство",
              "Оперативная лента",
              "Обращения",
              "Аналитика",
              "ИИ-помощник",
            ].map((item, index) => (
              <div
                key={item}
                className={
                  index === 0
                    ? "rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white"
                    : "rounded-2xl px-4 py-3 text-sm text-zinc-500 transition hover:bg-zinc-100"
                }
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-black/[0.04] bg-white p-6 shadow-sm">
            <div className="mb-5 text-sm font-medium text-zinc-400">
              Пульс команды
            </div>

            <div className="space-y-6">
              <div>
                <div className="text-4xl font-black tracking-tight">94%</div>
                <div className="mt-1 text-sm text-zinc-500">
                  Ответов с помощью ИИ
                </div>
              </div>

              <div>
                <div className="text-4xl font-black tracking-tight">-63%</div>
                <div className="mt-1 text-sm text-zinc-500">
                  Меньше ручной рутины
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="border-r border-black/[0.04] bg-white">
          <div className="flex h-16 items-center justify-between border-b border-black/[0.04] px-6">
            <h2 className="text-lg font-semibold">Оперативная лента</h2>

            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-zinc-100 px-4 py-2 text-sm text-zinc-500">
                Фильтр
              </div>

              <div className="rounded-xl bg-zinc-100 px-4 py-2 text-sm text-zinc-500">
                Поиск
              </div>
            </div>
          </div>

          <div className="divide-y divide-black/[0.04]">
            <TicketPreview
              labels={[
                ["Нужен ответ", "bg-red-100 text-red-600"],
                ["Оплата", "bg-orange-100 text-orange-600"],
                ["Высокий приоритет", "bg-blue-100 text-blue-600"],
              ]}
              title="Клиента списали дважды после продления тарифа"
              summary="Клиент сообщает о повторном списании. В истории видно, что он уже обращался по этому вопросу три раза."
              time="2 мин назад"
              dot="bg-red-500"
            />

            <TicketPreview
              labels={[
                ["ИИ определил тему", "bg-emerald-100 text-emerald-600"],
                ["Предложение", "bg-violet-100 text-violet-600"],
              ]}
              title="Добавить уведомления для команды"
              summary="Клиент просит получать уведомления о новых обращениях и изменениях статуса внутри рабочего пространства."
              time="12 мин назад"
              dot="bg-emerald-500"
            />
          </div>
        </main>

        <aside className="hidden bg-[#fafafa] p-5 lg:block">
          <div className="mb-5 rounded-[32px] border border-black/[0.04] bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold">ИИ-помощник</h3>
              <span className="text-sm font-medium text-emerald-600">
                Готов помочь
              </span>
            </div>

            <div className="space-y-6">
              <Insight
                title="Настроение клиента"
                value="Раздражён / высокая срочность"
                danger
              />

              <Insight
                title="Рекомендуемое действие"
                value="Передать обращение специалисту по оплатам и предложить проверку возврата средств."
              />

              <div>
                <div className="mb-2 text-xs uppercase tracking-wide text-zinc-400">
                  Черновик ответа
                </div>

                <div className="rounded-2xl bg-zinc-100 p-4 text-sm leading-relaxed text-zinc-600">
                  Здравствуйте! Извините за неудобства. Мы уже проверяем
                  повторное списание и вернёмся с результатом в ближайшее время.
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-black/[0.04] bg-white p-6 shadow-sm">
            <div className="mb-6 text-sm font-medium text-zinc-400">
              Сегодня
            </div>

            <Metric label="Среднее время ответа" value="4 мин" width="82%" />
            <Metric label="Решено обращений" value="128" width="74%" />
          </div>
        </aside>
      </div>
    </div>
  );
}