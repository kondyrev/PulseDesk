function PricingCard({
  name,
  price,
  description,
  features,
  button,
  popular,
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  button: string;
  popular?: boolean;
}) {
  if (popular) {
    return (
      <div className="rounded-[36px] p-10 bg-black text-white relative overflow-hidden shadow-2xl scale-[1.03]">
        <div className="absolute top-6 right-6 px-4 py-2 rounded-full bg-white text-black text-xs font-bold">
          Популярный
        </div>

        <div className="text-zinc-400 font-medium mb-5">{name}</div>
        <div className="text-6xl font-black tracking-tight mb-3">{price}</div>
        <div className="text-zinc-500 mb-10">{description}</div>

        <ul className="space-y-5 text-zinc-300 mb-12 text-lg">
          {features.map((feature) => (
            <li key={feature}>✓ {feature}</li>
          ))}
        </ul>

        <button className="w-full py-5 rounded-3xl bg-white text-black hover:opacity-90 transition font-semibold">
          {button}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-black/[0.04] rounded-[36px] p-10 shadow-sm hover:-translate-y-1 hover:shadow-xl transition">
      <div className="text-zinc-400 font-medium mb-5">{name}</div>
      <div className="text-6xl font-black tracking-tight mb-3">{price}</div>
      <div className="text-zinc-500 mb-10">{description}</div>

      <ul className="space-y-5 text-zinc-600 mb-12 text-lg">
        {features.map((feature) => (
          <li key={feature}>✓ {feature}</li>
        ))}
      </ul>

      <button className="w-full py-5 rounded-3xl bg-zinc-100 hover:bg-zinc-200 transition font-semibold">
        {button}
      </button>
    </div>
  );
}

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="py-32 bg-white border-t border-black/[0.04]"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto mb-24">
          <div className="text-sm uppercase tracking-[0.3em] text-zinc-400 mb-6">
            Тарифы
          </div>

          <h2 className="text-5xl md:text-7xl font-black tracking-[-0.05em] leading-[0.95] mb-8">
            Подходит стартапам
            <br />
            и большим командам.
          </h2>

          <p className="text-2xl text-zinc-500 leading-relaxed">
            Начните бесплатно и масштабируйтесь по мере роста поддержки.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          <PricingCard
            name="Starter"
            price="0₽"
            description="Для небольших команд"
            button="Начать"
            features={[
              "До 2 сотрудников",
              "Realtime тикеты",
              "Базовые AI summary",
              "Загрузка файлов",
            ]}
          />

          <PricingCard
            name="Pro"
            price="2 990₽"
            description="За workspace / месяц"
            button="Попробовать бесплатно"
            popular
            features={[
              "Безлимит сотрудников",
              "AI-подсказки ответов",
              "Анализ тональности",
              "AI summary тикетов",
              "Приоритетная очередь",
              "Дашборд аналитики",
            ]}
          />

          <PricingCard
            name="Enterprise"
            price="Custom"
            description="Для больших support-команд"
            button="Связаться с нами"
            features={[
              "Кастомные AI workflow",
              "SLA автоматизация",
              "Продвинутая аналитика",
              "Выделенная инфраструктура",
              "Приоритетная поддержка",
            ]}
          />
        </div>
      </div>
    </section>
  );
}