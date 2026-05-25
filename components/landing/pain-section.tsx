import { Container } from "@/components/shared/container";
import { PremiumCard } from "@/components/shared/premium-card";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";

function PainCard({
  emoji,
  title,
  text,
}: {
  emoji: string;
  title: string;
  text: string;
}) {
  return (
    <PremiumCard className="p-8">
      <div className="text-5xl mb-6">{emoji}</div>

      <h3 className="text-2xl font-bold tracking-tight mb-4">{title}</h3>

      <p className="text-zinc-500 leading-relaxed">{text}</p>
    </PremiumCard>
  );
}

export function PainSection() {
  return (
    <Section id="pain" className="border-t-0">
      <Container>
        <SectionHeading
          eyebrow="Проблема"
          title={
            <>
              Поддержка не должна
              <br />
              быть источником стресса.
            </>
          }
          description="Большинство helpdesk-систем устарели. Они перегружают команды, замедляют ответы и превращают поддержку в хаос."
          className="mb-20"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PainCard
            emoji="😵"
            title="Перегруженные очереди"
            text="Срочные проблемы теряются среди сотен тикетов."
          />

          <PainCard
            emoji="⏳"
            title="Медленные ответы"
            text="Поддержка тратит часы на чтение переписок и ручные summary."
          />

          <PainCard
            emoji="🔥"
            title="Недовольные клиенты"
            text="Критические обращения замечают слишком поздно."
          />

          <PainCard
            emoji="🧩"
            title="Разрозненные процессы"
            text="AI существует отдельно, а не встроен в workflow команды."
          />
        </div>
      </Container>
    </Section>
  );
}