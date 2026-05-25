export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] text-black overflow-hidden">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-black/[0.04]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-sm shadow-lg">
              P
            </div>

            <div>
              <div className="font-bold tracking-tight text-lg">PulseDesk</div>
              <div className="text-xs text-zinc-500">
                AI-first support platform
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-10 text-sm text-zinc-500 font-medium">
            <a href="#pain" className="hover:text-black transition">
              Проблемы
            </a>
            <a href="#features" className="hover:text-black transition">
              Возможности
            </a>
            <a href="#pricing" className="hover:text-black transition">
              Тарифы
            </a>
            <a href="#faq" className="hover:text-black transition">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <button className="hidden sm:block text-sm font-medium text-zinc-600 hover:text-black transition">
              Войти
            </button>

            <button className="px-5 py-3 rounded-2xl bg-black text-white text-sm font-semibold hover:opacity-90 transition shadow-lg">
              Попробовать бесплатно
            </button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-[#f5f5f7]" />
        <div className="absolute top-0 left-0 w-[640px] h-[640px] bg-blue-200/30 blur-3xl rounded-full" />
        <div className="absolute top-0 right-0 w-[640px] h-[640px] bg-violet-200/30 blur-3xl rounded-full" />

        <div className="max-w-7xl mx-auto px-6 pt-28 pb-28 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-black/[0.04] shadow-sm text-sm text-zinc-600 mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              AI-платформа поддержки нового поколения
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-[-0.06em] leading-[0.92] mb-8">
              Поддержка клиентов,
              <br />
              которая думает
              <br />
              вместе с вами.
            </h1>

            <p className="text-xl md:text-2xl text-zinc-500 leading-relaxed max-w-3xl mx-auto mb-12 font-medium">
              PulseDesk объединяет AI, realtime-работу команды и современный UX
              в единую платформу поддержки для SaaS и digital-команд.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-5 mb-20">
              <button className="px-8 py-5 rounded-3xl bg-black text-white text-base font-semibold hover:opacity-90 transition shadow-2xl">
                Начать бесплатно
              </button>

              <button className="px-8 py-5 rounded-3xl bg-white text-black text-base font-semibold border border-black/5 hover:bg-zinc-50 transition">
                Смотреть демо
              </button>
            </div>
          </div>

          <div className="max-w-6xl mx-auto rounded-[40px] overflow-hidden bg-white border border-black/[0.04] shadow-[0_50px_100px_rgba(0,0,0,0.08)]">
            <div className="h-16 border-b border-black/[0.04] bg-white flex items-center px-6 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>

            <div className="grid lg:grid-cols-[260px_1fr_340px] min-h-[700px] bg-[#fafafa]">
              <aside className="bg-white border-r border-black/[0.04] p-5 hidden lg:block">
                <div className="space-y-2">
                  {["Дашборд", "Входящие", "Тикеты", "Аналитика", "AI Copilot"].map(
                    (item, index) => (
                      <div
                        key={item}
                        className={
                          index === 0
                            ? "px-4 py-3 rounded-2xl bg-black text-white font-medium text-sm"
                            : "px-4 py-3 rounded-2xl text-zinc-500 hover:bg-zinc-100 transition text-sm"
                        }
                      >
                        {item}
                      </div>
                    )
                  )}
                </div>

                <div className="mt-10 bg-white border border-black/[0.04] rounded-3xl p-6 shadow-sm">
                  <div className="text-sm text-zinc-400 mb-5 font-medium">
                    Эффективность команды
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="text-4xl font-black tracking-tight">
                        94%
                      </div>
                      <div className="text-zinc-500 text-sm mt-1">
                        Ответов с AI-помощью
                      </div>
                    </div>

                    <div>
                      <div className="text-4xl font-black tracking-tight">
                        -63%
                      </div>
                      <div className="text-zinc-500 text-sm mt-1">
                        Быстрее закрытие тикетов
                      </div>
                    </div>
                  </div>
                </div>
              </aside>

              <main className="border-r border-black/[0.04] bg-white">
                <div className="h-16 border-b border-black/[0.04] px-6 flex items-center justify-between">
                  <h2 className="font-semibold text-lg">Приоритетные тикеты</h2>

                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-xl bg-zinc-100 text-sm text-zinc-500">
                      Фильтр
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-zinc-100 text-sm text-zinc-500">
                      Поиск
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-black/[0.04]">
                  <TicketPreview
                    labels={[
                      ["Недовольный клиент", "bg-red-100 text-red-600"],
                      ["Оплата", "bg-orange-100 text-orange-600"],
                      ["Высокий приоритет", "bg-blue-100 text-blue-600"],
                    ]}
                    title="Клиента списали дважды после обновления подписки"
                    summary="Пользователь сообщает о двойном списании после апгрейда тарифа. Клиент уже обращался в поддержку 3 раза."
                    time="2 мин назад"
                    dot="bg-red-500"
                  />

                  <TicketPreview
                    labels={[
                      ["AI классифицировал", "bg-emerald-100 text-emerald-600"],
                      ["Feature request", "bg-violet-100 text-violet-600"],
                    ]}
                    title="Добавить интеграцию со Slack для уведомлений"
                    summary="Клиент просит интеграцию со Slack для realtime-уведомлений и командной работы."
                    time="12 мин назад"
                    dot="bg-emerald-500"
                  />
                </div>
              </main>

              <aside className="bg-[#fafafa] p-5 hidden lg:block">
                <div className="bg-white border border-black/[0.04] rounded-[32px] p-6 mb-5 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-lg">AI Copilot</h3>
                    <span className="text-emerald-600 text-sm font-medium">
                      Онлайн
                    </span>
                  </div>

                  <div className="space-y-6">
                    <Insight title="Тональность" value="Раздражен / высокая срочность" danger />
                    <Insight
                      title="Рекомендуемое действие"
                      value="Передать тикет billing-специалисту и предложить проверку возврата средств."
                    />

                    <div>
                      <div className="text-xs uppercase tracking-wide text-zinc-400 mb-2">
                        Предлагаемый ответ
                      </div>
                      <div className="rounded-2xl bg-zinc-100 p-4 text-sm text-zinc-600 leading-relaxed">
                        Здравствуйте! Извиняемся за задержку и неудобства. Мы
                        уже проверяем двойное списание и скоро сообщим результат.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-black/[0.04] rounded-[32px] p-6 shadow-sm">
                  <div className="text-sm text-zinc-400 mb-6 font-medium">
                    Сегодня
                  </div>

                  <Metric label="Среднее время ответа" value="4 мин" width="82%" />
                  <Metric label="Решено сегодня" value="128" width="74%" />
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <section id="pain" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionIntro
            eyebrow="Проблема"
            title={
              <>
                Поддержка не должна
                <br />
                быть источником стресса.
              </>
            }
            text="Большинство helpdesk-систем устарели. Они перегружают команды, замедляют ответы и превращают поддержку в хаос."
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
        </div>
      </section>

      <section id="features" className="py-32 bg-[#f5f5f7] border-t border-black/[0.04]">
        <div className="max-w-7xl mx-auto px-6">
          <SectionIntro
            eyebrow="Возможности"
            title={
              <>
                AI встроен
                <br />
                в сам workflow.
              </>
            }
            text="PulseDesk не добавляет AI «сверху». Он становится частью ежедневной работы поддержки."
          />

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
                  <div key={item} className="rounded-2xl bg-zinc-100 px-5 py-4 text-zinc-600">
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
                <Badge className="bg-red-100 text-red-600">Недовольный клиент</Badge>
                <Badge className="bg-orange-100 text-orange-600">Запрос возврата</Badge>
                <Badge className="bg-blue-100 text-blue-600">Высокий приоритет</Badge>
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

      <section id="pricing" className="py-32 bg-white border-t border-black/[0.04]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto mb-24">
            <div className="text-sm uppercase tracking-[0.3em] text-zinc-400 mb-6">
              Тарифы
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-[-0.05em] leading-[0.95] mb-8">
              Подходит стартапам
              <br />
              и большим командам.
            </h2>
            <p className="text-2xl text-zinc-500 leading-relaxed">
              Начните бесплатно и масштабируйтесь по мере роста поддержки.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            <PricingCard
              name="Starter"
              price="0₽"
              description="Для небольших команд"
              button="Начать"
              features={[
                "До 2 сотрудников",
                "Realtime тикеты",
                "Базовые AI summary",
                "Загрузка файлов",
              ]}
            />

            <PricingCard
              name="Pro"
              price="2 990₽"
              description="За workspace / месяц"
              button="Попробовать бесплатно"
              popular
              features={[
                "Безлимит сотрудников",
                "AI-подсказки ответов",
                "Анализ тональности",
                "AI summary тикетов",
                "Приоритетная очередь",
                "Дашборд аналитики",
              ]}
            />

            <PricingCard
              name="Enterprise"
              price="Custom"
              description="Для больших support-команд"
              button="Связаться с нами"
              features={[
                "Кастомные AI workflow",
                "SLA автоматизация",
                "Продвинутая аналитика",
                "Выделенная инфраструктура",
                "Приоритетная поддержка",
              ]}
            />
          </div>
        </div>
      </section>

      <section id="faq" className="py-32 bg-[#f5f5f7] border-t border-black/[0.04]">
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

      <section className="py-32 bg-white border-t border-black/[0.04]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-7xl font-black tracking-[-0.05em] leading-[0.95] mb-8">
            Поддержка,
            <br />
            которая работает быстрее.
          </h2>

          <p className="text-2xl text-zinc-500 leading-relaxed max-w-3xl mx-auto mb-12">
            AI-first workflow, realtime collaboration и современный UX для
            команд поддержки нового поколения.
          </p>

          <button className="px-10 py-5 rounded-3xl bg-black text-white text-lg font-semibold hover:opacity-90 transition shadow-2xl">
            Попробовать бесплатно
          </button>
        </div>
      </section>

      <footer className="border-t border-black/[0.04] py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-sm">
              P
            </div>

            <div>
              <div className="font-bold tracking-tight">PulseDesk</div>
              <div className="text-sm text-zinc-500">
                AI-first платформа поддержки
              </div>
            </div>
          </div>

          <div className="text-sm text-zinc-500 text-center md:text-right">
            © 2026 PulseDesk. Создано для современных SaaS-команд.
          </div>
        </div>
      </footer>
    </main>
  );
}

function TicketPreview({
  labels,
  title,
  summary,
  time,
  dot,
}: {
  labels: [string, string][];
  title: string;
  summary: string;
  time: string;
  dot: string;
}) {
  return (
    <div className="p-6 hover:bg-zinc-50 transition cursor-pointer">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap mb-4">
            {labels.map(([label, className]) => (
              <span
                key={label}
                className={`px-3 py-1 rounded-full text-xs font-semibold ${className}`}
              >
                {label}
              </span>
            ))}
          </div>

          <h3 className="font-semibold text-xl mb-3 tracking-tight">{title}</h3>

          <p className="text-zinc-500 leading-relaxed max-w-2xl">
            AI summary: {summary}
          </p>
        </div>

        <div className="text-right">
          <div className="text-sm text-zinc-400 mb-3">{time}</div>
          <div className={`w-3 h-3 rounded-full ml-auto ${dot}`} />
        </div>
      </div>
    </div>
  );
}

function Insight({
  title,
  value,
  danger,
}: {
  title: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-zinc-400 mb-2">
        {title}
      </div>
      <div
        className={
          danger
            ? "font-semibold text-red-500"
            : "text-zinc-600 leading-relaxed text-sm"
        }
      >
        {value}
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  width,
}: {
  label: string;
  value: string;
  width: string;
}) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-center justify-between mb-2 text-sm">
        <span className="text-zinc-500">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>

      <div className="h-2 rounded-full bg-zinc-200 overflow-hidden">
        <div className="h-full bg-black rounded-full" style={{ width }} />
      </div>
    </div>
  );
}

function SectionIntro({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: React.ReactNode;
  text: string;
}) {
  return (
    <div className="max-w-4xl mb-20">
      <div className="text-sm uppercase tracking-[0.3em] text-zinc-400 mb-6">
        {eyebrow}
      </div>

      <h2 className="text-5xl md:text-7xl font-black tracking-[-0.05em] leading-[0.95] mb-8">
        {title}
      </h2>

      <p className="text-2xl text-zinc-500 leading-relaxed max-w-3xl">
        {text}
      </p>
    </div>
  );
}

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
    <div className="bg-white border border-black/[0.04] rounded-[32px] p-8 shadow-sm hover:-translate-y-1 hover:shadow-xl transition">
      <div className="text-5xl mb-6">{emoji}</div>
      <h3 className="text-2xl font-bold tracking-tight mb-4">{title}</h3>
      <p className="text-zinc-500 leading-relaxed">{text}</p>
    </div>
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

function Badge({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${className}`}>
      {children}
    </span>
  );
}

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
      <div className="rounded-[36px] p-10 bg-black text-white relative overflow-hidden shadow-2xl scale-[1.03]">
        <div className="absolute top-6 right-6 px-4 py-2 rounded-full bg-white text-black text-xs font-bold">
          Популярный
        </div>

        <div className="text-zinc-400 font-medium mb-5">{name}</div>
        <div className="text-6xl font-black tracking-tight mb-3">{price}</div>
        <div className="text-zinc-500 mb-10">{description}</div>

        <ul className="space-y-5 text-zinc-300 mb-12 text-lg">
          {features.map((feature) => (
            <li key={feature}>✓ {feature}</li>
          ))}
        </ul>

        <button className="w-full py-5 rounded-3xl bg-white text-black hover:opacity-90 transition font-semibold">
          {button}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-black/[0.04] rounded-[36px] p-10 shadow-sm hover:-translate-y-1 hover:shadow-xl transition">
      <div className="text-zinc-400 font-medium mb-5">{name}</div>
      <div className="text-6xl font-black tracking-tight mb-3">{price}</div>
      <div className="text-zinc-500 mb-10">{description}</div>

      <ul className="space-y-5 text-zinc-600 mb-12 text-lg">
        {features.map((feature) => (
          <li key={feature}>✓ {feature}</li>
        ))}
      </ul>

      <button className="w-full py-5 rounded-3xl bg-zinc-100 hover:bg-zinc-200 transition font-semibold">
        {button}
      </button>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-white border border-black/[0.04] rounded-[32px] p-8 shadow-sm">
      <h3 className="text-2xl font-bold tracking-tight mb-4">{question}</h3>
      <p className="text-zinc-500 text-lg leading-relaxed">{answer}</p>
    </div>
  );
}