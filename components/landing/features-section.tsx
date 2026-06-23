function ChannelRow({
  name,
  value,
}: {
  name: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-[#f5f5f7] px-5 py-4 text-zinc-700">
      <span className="font-medium">{name}</span>
      <span className="text-zinc-500">{value}</span>
    </div>
  );
}

function Bubble({
  children,
  variant = "client",
}: {
  children: React.ReactNode;
  variant?: "client" | "master";
}) {
  return (
    <div
      className={
        variant === "master"
          ? "ml-auto max-w-[80%] rounded-[20px] bg-white px-5 py-4 text-sm leading-6 text-black"
          : "max-w-[80%] rounded-[20px] bg-slate-700 px-5 py-4 text-sm leading-6 text-white"
      }
    >
      {children}
    </div>
  );
}

export function FeaturesSection() {
  const audiences = [
    {
      title: "Домашние мастера",
      description: "Сантехники, электрики, сборщики мебели, ремонтники.",
    },
    {
      title: "Красота и уход",
      description: "Мастера маникюра, парикмахеры, массажисты.",
    },
    {
      title: "Обучение",
      description: "Репетиторы, наставники, консультанты.",
    },
    {
      title: "Малый бизнес",
      description: "Сервисы, студии, небольшие магазины и локальные команды.",
    },
  ];

  return (
    <>
      <section className="bg-white py-28">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-2">
          <div className="rounded-[40px] border border-black/[0.04] bg-white p-8 shadow-sm md:p-12">
            <div className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400">
              Ответ не потеряется
            </div>

            <h2 className="mb-6 text-4xl font-black tracking-tight md:text-6xl">
              Клиент не потеряет
              <br />
              ваш ответ.
            </h2>

            <p className="mb-8 text-lg leading-8 text-zinc-500">
              Клиент выбирает, куда прислать ссылку на переписку: MAX,
              Telegram или почту. Когда вы ответите, он получит уведомление и
              вернётся в тот же диалог с вами.
            </p>

            <div className="space-y-4">
              <ChannelRow name="MAX" value="прислать ссылку" />
              <ChannelRow name="Telegram" value="прислать ссылку" />
              <ChannelRow name="Почта" value="прислать ссылку" />
            </div>
          </div>

          <div className="flex min-h-[460px] flex-col justify-end gap-4 rounded-[40px] bg-[#111827] p-8 text-white shadow-2xl md:p-12">
            <div className="mb-auto">
              <div className="mb-2 text-sm font-semibold text-white/50">
                Переписка сохраняется в Pulse
              </div>
              <div className="text-2xl font-black tracking-tight">
                Фото, сообщения и ответы мастера — в одном диалоге.
              </div>
            </div>

            <Bubble>Здравствуйте! Потекла труба под раковиной. Фото прикрепил.</Bubble>
            <Bubble variant="master">
              Добрый день. Вижу проблему. Могу подъехать сегодня после 18:00.
            </Bubble>
            <Bubble>Отлично, давайте. Телефон сейчас напишу в чат.</Bubble>
          </div>
        </div>
      </section>

      <section id="for" className="bg-[#fafafa] py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-20 max-w-3xl text-center">
            <div className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400">
              Для кого
            </div>

            <h2 className="mb-6 text-4xl font-black tracking-tight md:text-6xl">
              Для тех, кому важнее
              <br />
              заявки, чем сложные системы.
            </h2>

            <p className="text-lg leading-8 text-zinc-500">
              Pulse создаётся для людей, которые работают руками, опытом и
              репутацией.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {audiences.map((audience) => (
              <div
                key={audience.title}
                className="min-h-[220px] rounded-[32px] border border-black/[0.05] bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-8 h-1 w-14 rounded-full bg-black" />

                <h3 className="mb-4 text-2xl font-bold tracking-tight">
                  {audience.title}
                </h3>

                <p className="text-base leading-7 text-zinc-500">
                  {audience.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-20 rounded-[40px] bg-white p-10 shadow-sm md:p-14">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400">
                Без сайта
              </div>

              <h3 className="mb-6 text-3xl font-black tracking-tight md:text-5xl">
                Визитка → QR-код → диалог.
              </h3>

              <p className="text-lg leading-8 text-zinc-500">
                Pulse даёт мастеру цифровую страницу, QR-код и аккуратный чат
                для обращений. А когда появится сайт — Pulse можно подключить
                как виджет.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
