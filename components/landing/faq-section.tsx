import { Container } from "@/components/shared/container";
import { PremiumCard } from "@/components/shared/premium-card";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <PremiumCard className="p-8">
      <h3 className="mb-4 text-2xl font-bold tracking-tight">{question}</h3>

      <p className="text-lg leading-relaxed text-zinc-500">{answer}</p>
    </PremiumCard>
  );
}

export function FaqSection() {
  return (
    <Section id="faq" muted>
      <Container className="max-w-5xl">
        <SectionHeading
          eyebrow="FAQ"
          title="Частые вопросы."
          align="center"
          className="mb-20"
        />

        <div className="space-y-6">
          <FaqItem
            question="PulseDesk — это чат-бот?"
            answer="Нет. PulseDesk — полноценная AI-first платформа поддержки для SaaS и digital-команд. AI помогает операторам, но не заменяет весь процесс поддержки."
          />

          <FaqItem
            question="AI заменяет сотрудников поддержки?"
            answer="Нет. PulseDesk помогает командам отвечать быстрее, лучше приоритизировать обращения и не терять важный контекст."
          />

          <FaqItem
            question="Можно ли использовать PulseDesk в существующем SaaS?"
            answer="Да. Платформа проектируется под современные SaaS workflow: тикеты, realtime, роли, файлы, AI summary и интеграции."
          />

          <FaqItem
            question="Подходит ли продукт для российской аудитории?"
            answer="Да. Интерфейс, тарифы и сценарии использования ориентированы на российские SaaS, digital-команды и сервисные компании."
          />
        </div>
      </Container>
    </Section>
  );
}