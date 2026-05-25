function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-white border border-black/[0.04] rounded-[32px] p-8 shadow-sm">
      <h3 className="text-2xl font-bold tracking-tight mb-4">{question}</h3>

      <p className="text-zinc-500 text-lg leading-relaxed">{answer}</p>
    </div>
  );
}

export function FaqSection() {
  return (
    <section
      id="faq"
      className="py-32 bg-[#f5f5f7] border-t border-black/[0.04]"
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="text-sm uppercase tracking-[0.3em] text-zinc-400 mb-6">
            FAQ
          </div>

          <h2 className="text-5xl md:text-7xl font-black tracking-[-0.05em] leading-[0.95]">
            Частые вопросы.
          </h2>
        </div>

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
      </div>
    </section>
  );
}