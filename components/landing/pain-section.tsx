export function PainSection() {
  const items = [
    {
      title: "Обращения теряются",
      description:
        "Письма, мессенджеры и чаты живут отдельно. Команда тратит время не на помощь клиентам, а на поиск информации.",
    },
    {
      title: "Контекст приходится собирать вручную",
      description:
        "Чтобы разобраться в ситуации, оператор открывает несколько вкладок и перечитывает длинные переписки.",
    },
    {
      title: "Рутина съедает рабочий день",
      description:
        "Одни и те же вопросы повторяются снова и снова, а сотрудники отвечают на них вручную.",
    },
  ];

  return (
    <section
      id="pain"
      className="border-y border-black/[0.04] bg-[#fafafa] py-28"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <div className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400">
            Каждый рабочий день
          </div>

          <h2 className="mb-6 text-4xl font-black tracking-tight md:text-6xl">
            Поддержка не должна
            <br />
            превращаться в хаос.
          </h2>

          <p className="text-lg leading-8 text-zinc-500">
            Большинство команд работают сразу в нескольких окнах, теряют
            контекст и постоянно повторяют одни и те же действия. PulseDesk
            помогает вернуть порядок и сосредоточиться на самом важном —
            общении с клиентом.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-black/[0.04] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-lg font-bold">
                •
              </div>

              <h3 className="mb-3 text-xl font-bold">{item.title}</h3>

              <p className="leading-7 text-zinc-500">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-4xl rounded-[32px] bg-black px-10 py-12 text-center text-white">
          <p className="text-2xl font-semibold leading-relaxed md:text-3xl">
            PulseDesk объединяет обращения, историю переписки и помощь
            искусственного интеллекта в одном спокойном рабочем пространстве.
          </p>
        </div>
      </div>
    </section>
  );
}