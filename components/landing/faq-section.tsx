import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";

const faqs = [
  {
    question: "Клиенту нужно устанавливать приложение?",
    answer:
      "Нет. Клиент сканирует QR-код, открывает страницу в браузере и пишет мастеру. MAX, Telegram или почта нужны только для получения ссылки на диалог и уведомления об ответе.",
  },
  {
    question: "Нужно ли клиенту оставлять телефон?",
    answer:
      "Нет. На старте клиент может выбрать MAX, Telegram или почту. Телефоном он может поделиться позже в чате, если сам захочет.",
  },
  {
    question: "Что будет, если мастер ответит позже?",
    answer:
      "Клиент получит уведомление в выбранный канал и вернётся по личной ссылке в тот же диалог. Переписка, фотографии и ответы сохраняются в Pulse.",
  },
  {
    question: "Можно ли использовать Pulse без сайта?",
    answer:
      "Да. QR-код и цифровая страница уже работают как простой канал связи с клиентами. QR можно разместить на визитке, объявлении, машине, двери или в социальных сетях.",
  },
  {
    question: "Можно ли подключить сайт позже?",
    answer:
      "Да. Когда у мастера или компании появится сайт, Pulse можно будет подключить как виджет для обращений.",
  },
  {
    question: "Зачем тогда MAX, Telegram и почта?",
    answer:
      "Они нужны не для самой переписки, а для уведомлений. Диалог остаётся внутри Pulse, чтобы мастер не терял историю, фотографии и обращения клиентов.",
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
              Без технической магии.
              <br />
              Просто и понятно.
            </>
          }
          description="Коротко о том, как клиент пишет мастеру и почему переписка не теряется."
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
