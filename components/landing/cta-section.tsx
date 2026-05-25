import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";

export function CtaSection() {
  return (
    <Section>
      <Container className="max-w-5xl text-center">
        <h2 className="mb-8 text-5xl font-black leading-[0.95] tracking-[-0.05em] md:text-7xl">
          Поддержка,
          <br />
          которая работает быстрее.
        </h2>

        <p className="mx-auto mb-12 max-w-3xl text-2xl leading-relaxed text-zinc-500">
          AI-first workflow, realtime collaboration и современный UX для команд
          поддержки нового поколения.
        </p>

        <button className="rounded-3xl bg-black px-10 py-5 text-lg font-semibold text-white shadow-2xl transition hover:opacity-90">
          Попробовать бесплатно
        </button>
      </Container>
    </Section>
  );
}