import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";

const faqs = [
  {
    question: "PulseDesk заменяет обычную систему поддержки?",
    answer:
      "Да. PulseDesk собирает обращения, переписку, статусы, командную работу и ИИ-помощника в одном рабочем пространстве. Его можно использовать как основную систему поддержки клиентов.",
  },
  {
    question: "Нужно ли устанавливать что-то на сайт?",
    answer:
      "Нет. Для подключения достаточно добавить небольшой виджет на сайт. После этого клиенты смогут оставлять обращения, а команда будет видеть их внутри PulseDesk.",
  },
  {
    question: "ИИ будет отвечать клиентам сам?",
    answer:
      "На старте ИИ помогает оператору: кратко пересказывает обращение, определяет настроение клиента и предлагает черновик ответа. Финальное решение остаётся за сотрудником поддержки.",
  },
  {
    question: "Подойдёт ли PulseDesk небольшой команде?",
    answer:
      "Да. PulseDesk создаётся так, чтобы быть понятным для небольшой команды с первых дней и при этом спокойно расти вместе с количеством обращений, сотрудников и рабочих процессов.",
  },
  {
    question: "Можно ли использовать PulseDesk для российского бизнеса?",
    answer:
      "Да. PulseDesk изначально проектируется под российский B2B-рынок: с русским интерфейсом, понятной терминологией и возможностью использовать российские ИИ-сервисы.",
  },
  {
    question: "Чем PulseDesk отличается от обычной админки?",
    answer:
      "PulseDesk — это не набор таблиц и кнопок, а спокойное рабочее пространство поддержки. Его задача — не перегружать оператора, а помогать быстрее понять ситуацию и уверенно ответить клиенту.",
  },
];

export function FaqSection() {
  return (
    <Section id="faq" className="bg-[#fafafa]">
      <Container>
        <SectionHeading
          eyebrow="Вопросы"
          title={
            <>
              Всё, что важно
              <br />
              уточнить заранее.
            </>
          }
          description="Коротко о том, как работает PulseDesk и для каких команд он подходит."
          align="center"
          className="mb-20"
        />

        <div className="mx-auto max-w-4xl space-y-5">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-[28px] border border-black/[0.04] bg-white p-8 shadow-sm"
            >
              <h3 className="mb-4 text-xl font-bold tracking-tight">
                {faq.question}
              </h3>

              <p className="leading-7 text-zinc-500">{faq.answer}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}