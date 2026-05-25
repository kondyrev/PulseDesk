function Badge({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`px-4 py-2 rounded-full text-sm font-semibold ${className}`}
    >
      {children}
    </span>
  );
}

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
    <div className="bg-white border border-black/[0.04] rounded-[36px] p-10 shadow-sm hover:-translate-y-1 hover:shadow-xl transition">
      <div className="text-sm text-zinc-400 mb-5 font-medium">{eyebrow}</div>

      <h3 className="text-4xl font-black tracking-tight mb-5">{title}</h3>

      <p className="text-zinc-500 text-lg leading-relaxed mb-8">{text}</p>

      {children}
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-32 bg-[#f5f5f7] border-t border-black/[0.04]"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-4xl mb-20">
          <div className="text-sm uppercase tracking-[0.3em] text-zinc-400 mb-6">
            Возможности
          </div>

          <h2 className="text-5xl md:text-7xl font-black tracking-[-0.05em] leading-[0.95] mb-8">
            AI встроен
            <br />
            в сам workflow.
          </h2>

          <p className="text-2xl text-zinc-500 leading-relaxed max-w-3xl">
            PulseDesk не добавляет AI «сверху». Он становится частью ежедневной
            работы поддержки.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <FeatureCard
            eyebrow="AI Copilot"
            title="AI-подсказки ответов"
            text="AI анализирует контекст тикета, эмоции клиента и историю переписки, чтобы предложить готовый ответ."
          >
            <div className="rounded-3xl bg-zinc-100 p-6 text-zinc-600 leading-relaxed">
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
            <div className="flex gap-3 flex-wrap">
              <Badge className="bg-red-100 text-red-600">
                Недовольный клиент
              </Badge>

              <Badge className="bg-orange-100 text-orange-600">
                Запрос возврата
              </Badge>

              <Badge className="bg-blue-100 text-blue-600">
                Высокий приоритет
              </Badge>
            </div>
          </FeatureCard>

          <FeatureCard
            eyebrow="Командная работа"
            title="Realtime workspace"
            text="Операторы, администраторы и AI работают в одном пространстве: тикеты, сообщения, файлы и контекст доступны сразу."
          >
            <div className="flex -space-x-4">
              <div className="w-14 h-14 rounded-full bg-zinc-900 border-4 border-white" />
              <div className="w-14 h-14 rounded-full bg-zinc-600 border-4 border-white" />
              <div className="w-14 h-14 rounded-full bg-zinc-300 border-4 border-white" />
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}