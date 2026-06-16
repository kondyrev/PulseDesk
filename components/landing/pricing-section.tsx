import { Container } from "@/components/shared/container";
import { PremiumCard } from "@/components/shared/premium-card";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";

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
      <div className="relative scale-[1.03] overflow-hidden rounded-[36px] bg-black p-10 text-white shadow-2xl">
        <div className="absolute right-6 top-6 rounded-full bg-white px-4 py-2 text-xs font-bold text-black">
          Оптимальный выбор
        </div>

        <div className="mb-5 font-medium text-zinc-400">{name}</div>
        <div className="mb-3 text-6xl font-black tracking-tight">{price}</div>
        <div className="mb-10 text-zinc-400">{description}</div>

        <ul className="mb-12 space-y-5 text-lg text-zinc-300">
          {features.map((feature) => (
            <li key={feature}>✓ {feature}</li>
          ))}
        </ul>

        <button className="w-full rounded-3xl bg-white py-5 font-semibold text-black transition hover:opacity-90">
          {button}
        </button>
      </div>
    );
  }

  return (
    <PremiumCard className="rounded-[36px] p-10">
      <div className="mb-5 font-medium text-zinc-400">{name}</div>
      <div className="mb-3 text-6xl font-black tracking-tight">{price}</div>
      <div className="mb-10 text-zinc-500">{description}</div>

      <ul className="mb-12 space-y-5 text-lg text-zinc-600">
        {features.map((feature) => (
          <li key={feature}>✓ {feature}</li>
        ))}
      </ul>

      <button className="w-full rounded-3xl bg-zinc-100 py-5 font-semibold transition hover:bg-zinc-200">
        {button}
      </button>
    </PremiumCard>
  );
}

export function PricingSection() {
  return (
    <Section id="pricing">
      <Container>
        <SectionHeading
          eyebrow="Тарифы"
          title={
            <>
              Начните спокойно.
              <br />
              Растите без хаоса.
            </>
          }
          description="PulseDesk подойдёт небольшой команде поддержки сегодня и сможет расти вместе с вашим бизнесом завтра."
          align="center"
          className="mb-24"
        />

        <div className="grid items-stretch gap-8 lg:grid-cols-3">
          <PricingCard
            name="Старт"
            price="0 ₽"
            description="Для первых обращений и знакомства с продуктом"
            button="Начать бесплатно"
            features={[
              "До 2 сотрудников",
              "Единая лента обращений",
              "Базовая история переписки",
              "Виджет для сайта",
            ]}
          />

          <PricingCard
            name="Команда"
            price="2 990 ₽"
            description="За рабочее пространство в месяц"
            button="Попробовать бесплатно"
            popular
            features={[
              "Без ограничений по сотрудникам",
              "ИИ-помощник для ответов",
              "Краткое содержание обращений",
              "Определение настроения клиента",
              "Приоритеты и статусы",
              "Аналитика работы поддержки",
            ]}
          />

          <PricingCard
            name="Бизнес"
            price="По запросу"
            description="Для компаний с особыми требованиями"
            button="Обсудить внедрение"
            features={[
              "Индивидуальные сценарии работы",
              "Расширенная автоматизация",
              "Отдельные правила доступа",
              "Помощь с внедрением",
              "Приоритетная поддержка",
            ]}
          />
        </div>
      </Container>
    </Section>
  );
}