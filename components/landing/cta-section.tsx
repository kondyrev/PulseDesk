export function CtaSection() {
  return (
    <section className="py-32 bg-white border-t border-black/[0.04]">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-5xl md:text-7xl font-black tracking-[-0.05em] leading-[0.95] mb-8">
          Поддержка,
          <br />
          которая работает быстрее.
        </h2>

        <p className="text-2xl text-zinc-500 leading-relaxed max-w-3xl mx-auto mb-12">
          AI-first workflow, realtime collaboration и современный UX для команд
          поддержки нового поколения.
        </p>

        <button className="px-10 py-5 rounded-3xl bg-black text-white text-lg font-semibold hover:opacity-90 transition shadow-2xl">
          Попробовать бесплатно
        </button>
      </div>
    </section>
  );
}