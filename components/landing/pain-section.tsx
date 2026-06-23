export function PainSection() {
  const steps = [
    {
      title: "Клиент сканирует QR",
      description:
        "На визитке, объявлении, машине, двери мастерской или в социальных сетях.",
    },
    {
      title: "Выбирает канал",
      description:
        "MAX, Telegram или почта — только чтобы получить личную ссылку на диалог.",
    },
    {
      title: "Пишет сообщение",
      description:
        "Описывает задачу, прикрепляет фотографии и отправляет обращение мастеру.",
    },
    {
      title: "Возвращается в чат",
      description:
        "Когда мастер ответит, клиент получит уведомление и откроет тот же диалог.",
    },
  ];

  return (
    <section
      id="how"
      className="border-y border-black/[0.04] bg-[#fafafa] py-28"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <div className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400">
            Как это работает
          </div>

          <h2 className="mb-6 text-4xl font-black tracking-tight md:text-6xl">
            Один QR-код становится
            <br />
            каналом связи с клиентом.
          </h2>

          <p className="text-lg leading-8 text-zinc-500">
            Клиенту не нужно устанавливать приложение. Мастеру не нужно
            заводить сайт. Вся переписка сохраняется в Pulse.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-3xl border border-black/[0.04] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-lg font-black">
                {index + 1}
              </div>

              <h3 className="mb-3 text-xl font-bold tracking-tight">
                {step.title}
              </h3>

              <p className="leading-7 text-zinc-500">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-5xl rounded-[36px] bg-black px-10 py-12 text-center text-white">
          <p className="text-2xl font-semibold leading-relaxed md:text-3xl">
            Главное: мастер может ответить позже, а клиент всё равно увидит
            ответ и вернётся в тот же диалог.
          </p>
        </div>
      </div>
    </section>
  );
}
