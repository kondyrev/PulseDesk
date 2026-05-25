import { Container } from "@/components/shared/container";
import { Pill } from "@/components/shared/pill";
import { PremiumCard } from "@/components/shared/premium-card";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";

function FeatureCard({
  eyebrow,
  title,
  text,
  children,
}: {
  eyebrow: string;
  title: string;
  text: string;
  children: React.ReactNode;
}) {
  return (
    <PremiumCard className="rounded-[36px] p-10">
      <div className="mb-5 text-sm font-medium text-zinc-400">{eyebrow}</div>

      <h3 className="mb-5 text-4xl font-black tracking-tight">{title}</h3>

      <p className="mb-8 text-lg leading-relaxed text-zinc-500">{text}</p>

      {children}
    </PremiumCard>
  );
}

export function FeaturesSection() {
  return (
    <Section id="features" muted>
      <Container>
        <SectionHeading
          eyebrow="Возможности"
          title={
            <>
              AI встроен
              <br />в сам workflow.
            </>
          }
          description="PulseDesk не добавляет AI «сверху». Он становится частью ежедневной работы поддержки."
          className="mb-20"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <FeatureCard
            eyebrow="AI Copilot"
            title="AI-подсказки ответов"
            text="AI анализирует контекст тикета, эмоции клиента и историю переписки, чтобы предложить готовый ответ."
          >
            <div className="rounded-3xl bg-zinc-100 p-6 leading-relaxed text-zinc-600">
              «Здравствуйте! Мы уже проверяем проблему с оплатой и вернемся с
              обновлением в ближайшее время.»
            </div>
          </FeatureCard>

          <FeatureCard
            eyebrow="Realtime AI"
            title="Мгновенные summary"
            text="Перестаньте читать огромные цепочки сообщений. AI выделяет главное за секунды."
          >
            <div className="space-y-3">
              {[
                "Обнаружена проблема с оплатой",
                "Клиент обращался 3 раза",
                "Высокий риск эскалации",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-zinc-100 px-5 py-4 text-zinc-600"
                >
                  {item}
                </div>
              ))}
            </div>
          </FeatureCard>

          <FeatureCard
            eyebrow="Приоритизация"
            title="Определение эмоций и срочности"
            text="PulseDesk подсвечивает раздраженных клиентов и критические обращения до того, как они перерастут в проблему."
          >
            <div className="flex flex-wrap gap-3">
              <Pill className="bg-red-100 text-red-600">
                Недовольный клиент
              </Pill>
              <Pill className="bg-orange-100 text-orange-600">
                Запрос возврата
              </Pill>
              <Pill className="bg-blue-100 text-blue-600">
                Высокий приоритет
              </Pill>
            </div>
          </FeatureCard>

          <FeatureCard
            eyebrow="Командная работа"
            title="Realtime workspace"
            text="Операторы, администраторы и AI работают в одном пространстве: тикеты, сообщения, файлы и контекст доступны сразу."
          >
            <div className="flex -space-x-4">
              <div className="h-14 w-14 rounded-full border-4 border-white bg-zinc-900" />
              <div className="h-14 w-14 rounded-full border-4 border-white bg-zinc-600" />
              <div className="h-14 w-14 rounded-full border-4 border-white bg-zinc-300" />
            </div>
          </FeatureCard>
        </div>
      </Container>
    </Section>
  );
}