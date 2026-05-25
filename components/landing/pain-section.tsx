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

export function PainSection() {
  return (
    <section id="pain" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-4xl mb-20">
          <div className="text-sm uppercase tracking-[0.3em] text-zinc-400 mb-6">
            Проблема
          </div>

          <h2 className="text-5xl md:text-7xl font-black tracking-[-0.05em] leading-[0.95] mb-8">
            Поддержка не должна
            <br />
            быть источником стресса.
          </h2>

          <p className="text-2xl text-zinc-500 leading-relaxed max-w-3xl">
            Большинство helpdesk-систем устарели. Они перегружают команды,
            замедляют ответы и превращают поддержку в хаос.
          </p>
        </div>

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
  );
}