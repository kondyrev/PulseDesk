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
          Для стабильной работы
        </div>

        <div className="mb-5 font-medium text-zinc-400">{name}</div>
        <div className="mb-3 text-6xl font-black tracking-tight">{price}</div>
        <div className="mb-10 text-zinc-400">{description}</div>

        <ul className="mb-12 space-y-5 text-lg text-zinc-300">
          {features.map((feature) => (
            <li key={feature}>✓ {feature}</li>
          ))}
        </ul>

        <a
          href="/dashboard"
          className="block w-full rounded-3xl bg-white py-5 text-center font-semibold text-black transition hover:opacity-90"
        >
          {button}
        </a>
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

      <a
        href="/dashboard"
        className="block w-full rounded-3xl bg-zinc-100 py-5 text-center font-semibold transition hover:bg-zinc-200"
      >
        {button}
      </a>
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
              Начать можно бесплатно.
              <br />
              Расти — когда появятся заявки.
            </>
          }
          description="Pulse не требует сложного внедрения. Сначала QR-код и цифровая страница, затем больше обращений, уведомлений и командная работа."
          align="center"
          className="mb-24"
        />

        <div className="grid items-stretch gap-8 lg:grid-cols-3">
          <PricingCard
            name="Старт"
            price="0 ₽"
            description="Для первого QR-кода и проверки идеи"
            button="Начать бесплатно"
            features={[
              "Личный QR-код",
              "Цифровая страница мастера",
              "До 20 обращений",
              "Уведомления на почту",
            ]}
          />

          <PricingCard
            name="Мастер"
            price="299 ₽"
            description="За спокойный приём заявок каждый месяц"
            button="Выбрать тариф"
            popular
            features={[
              "Безлимитные обращения",
              "MAX и Telegram уведомления",
              "Фотографии в диалогах",
              "История обращений",
              "Настройка страницы мастера",
            ]}
          />

          <PricingCard
            name="Команда"
            price="990 ₽"
            description="Когда обращений становится больше"
            button="Подключить команду"
            features={[
              "Несколько сотрудников",
              "Распределение обращений",
              "ИИ-помощник для ответов",
              "Виджет для сайта",
              "Расширенная история",
            ]}
          />
        </div>
      </Container>
    </Section>
  );
}
