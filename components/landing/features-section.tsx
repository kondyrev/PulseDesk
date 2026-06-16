export function FeaturesSection() {
  const features = [
    {
      title: "Оперативная лента",
      description:
        "Все обращения собраны в одном месте. Новые сообщения, статусы и изменения появляются перед глазами без лишнего шума.",
    },
    {
      title: "ИИ-помощник",
      description:
        "Помогает разобраться в переписке, предлагает варианты ответа и экономит время на рутинных действиях.",
    },
    {
      title: "Полный контекст",
      description:
        "История общения, данные клиента и вся переписка находятся рядом. Не нужно переключаться между десятками вкладок.",
    },
    {
      title: "Командная работа",
      description:
        "Каждый оператор видит актуальное состояние обращения и понимает, что происходит прямо сейчас.",
    },
    {
      title: "Спокойный интерфейс",
      description:
        "Ничего лишнего. Только информация, которая действительно помогает быстро принять решение и ответить клиенту.",
    },
    {
      title: "Создано для роста",
      description:
        "PulseDesk одинаково удобен как для небольшой команды, так и для службы поддержки с большим потоком обращений.",
    },
  ];

  return (
    <section
      id="features"
      className="bg-white py-28"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <div className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400">
            Возможности
          </div>

          <h2 className="mb-6 text-4xl font-black tracking-tight md:text-6xl">
            Всё необходимое —
            <br />
            в одном окне.
          </h2>

          <p className="text-lg leading-8 text-zinc-500">
            PulseDesk объединяет поток обращений, рабочие инструменты команды и
            интеллектуальную помощь в единое пространство, где ничего не
            отвлекает от главного.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-[32px] border border-black/[0.05] bg-[#fafafa] p-8 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl"
            >
              <div className="mb-8 h-1 w-14 rounded-full bg-black" />

              <h3 className="mb-4 text-2xl font-bold tracking-tight">
                {feature.title}
              </h3>

              <p className="text-base leading-7 text-zinc-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 rounded-[40px] bg-[#f5f5f7] p-10 md:p-14">
          <div className="mx-auto max-w-4xl text-center">
            <h3 className="mb-6 text-3xl font-black tracking-tight md:text-5xl">
              Не просто отвечайте быстрее.
              <br />
              Работайте спокойнее.
            </h3>

            <p className="text-lg leading-8 text-zinc-500">
              Когда обращения, история переписки и помощь искусственного
              интеллекта находятся рядом, команда тратит меньше сил на поиск
              информации и больше — на решение задач клиентов.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}