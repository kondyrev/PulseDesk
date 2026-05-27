import { MessageSquare } from "lucide-react";

export function AICopilotCard() {
  return (
    <aside className="space-y-6">
      <div className="rounded-[36px] border border-black/[0.04] bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold tracking-tight">
            AI Copilot
          </h3>

          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
            Онлайн
          </span>
        </div>

        <div className="space-y-5">
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
              Summary дня
            </div>

            <p className="leading-relaxed text-zinc-600">
              Основной рост обращений связан с оплатой и
              восстановлением доступа. 7 клиентов требуют быстрого
              ответа.
            </p>
          </div>

          <div className="rounded-3xl bg-zinc-100 p-5">
            <div className="mb-2 text-sm font-semibold">
              Рекомендуемое действие
            </div>

            <p className="text-sm leading-relaxed text-zinc-500">
              Назначить billing-тикеты на старшего оператора и
              подготовить шаблон ответа по двойным списаниям.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[36px] border border-black/[0.04] bg-black p-6 text-white shadow-2xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
          <MessageSquare className="h-5 w-5" />
        </div>

        <h3 className="mb-3 text-2xl font-black tracking-tight">
          Команда отвечает быстрее.
        </h3>

        <p className="leading-relaxed text-zinc-400">
          AI summary и suggested replies сокращают ручную работу и
          помогают сохранить качество общения.
        </p>
      </div>
    </aside>
  );
}