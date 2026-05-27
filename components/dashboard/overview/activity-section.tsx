import { Users } from "lucide-react";

export function ActivitySection() {
  return (
    <section className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-[36px] border border-black/[0.04] bg-white p-6 shadow-sm lg:col-span-2">
        <h3 className="mb-6 text-xl font-bold tracking-tight">
          Активность команды
        </h3>

        <div className="space-y-5">
          {[
            "Мария закрыла тикет по оплате с AI-подсказкой",
            "AI отметил 3 обращения как высокий риск эскалации",
            "Алексей обновил статус workspace",
          ].map((item) => (
            <div key={item} className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-zinc-100" />

              <div className="text-sm text-zinc-600">
                {item}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[36px] border border-black/[0.04] bg-white p-6 shadow-sm">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100">
          <Users className="h-5 w-5" />
        </div>

        <div className="text-4xl font-black tracking-tight">
          8
        </div>

        <div className="mt-2 text-sm text-zinc-500">
          активных операторов сегодня
        </div>
      </div>
    </section>
  );
}