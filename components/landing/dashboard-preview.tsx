function QrCell({ active }: { active?: boolean }) {
  return (
    <span
      className={
        active
          ? "rounded-[5px] bg-black"
          : "rounded-[5px] bg-transparent"
      }
    />
  );
}

function MessengerOption({
  name,
  hint,
}: {
  name: string;
  hint: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-zinc-50 px-5 py-4 text-sm">
      <span className="font-medium text-zinc-800">{name}</span>
      <span className="text-zinc-400">{hint}</span>
    </div>
  );
}

export function DashboardPreview() {
  const cells = [
    true, false, true, false, true,
    false, true, true, false, true,
    true, true, false, true, false,
    false, true, false, true, true,
    true, false, true, false, true,
  ];

  return (
    <div className="relative min-h-[620px] overflow-hidden rounded-[44px] border border-white/70 bg-gradient-to-br from-white to-[#eef1f6] p-8 shadow-[0_50px_100px_rgba(15,23,42,0.12)]">
      <div className="absolute right-8 top-8 z-10 h-44 w-44 rounded-[32px] bg-white p-5 shadow-2xl">
        <div className="grid h-full grid-cols-5 gap-2">
          {cells.map((active, index) => (
            <QrCell key={index} active={active} />
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-8 w-[330px] rounded-[42px] bg-[#10131a] p-3 shadow-[0_35px_80px_rgba(15,23,42,0.30)]">
        <div className="min-h-[520px] rounded-[32px] bg-[#f9fafb] p-6">
          <div className="mb-7 flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-sky-100 to-violet-100" />

            <div>
              <div className="font-bold tracking-tight">
                Алексей, сантехник
              </div>
              <div className="text-xs text-zinc-500">
                Обычно отвечает в течение дня
              </div>
            </div>
          </div>

          <div className="mb-4 rounded-[24px] bg-white p-5 shadow-sm">
            <div className="mb-4 text-sm font-bold tracking-tight">
              Куда отправить ссылку на диалог?
            </div>

            <div className="space-y-3">
              <MessengerOption name="MAX" hint="прислать ссылку" />
              <MessengerOption name="Telegram" hint="прислать ссылку" />
              <MessengerOption name="Почта" hint="прислать ссылку" />
            </div>
          </div>

          <div className="rounded-[22px] bg-indigo-50 p-4 text-sm leading-6 text-slate-700">
            После этого откроется чат. Клиент сможет описать задачу,
            прикрепить фотографии и не потеряет ответ мастера.
          </div>
        </div>
      </div>

      <div className="absolute bottom-32 right-8 hidden max-w-[260px] rounded-[28px] bg-white/75 p-5 shadow-xl backdrop-blur md:block">
        <div className="mb-2 text-sm font-bold">QR можно разместить где угодно</div>
        <div className="text-sm leading-6 text-zinc-500">
          На визитке, объявлении, автомобиле, двери мастерской или в социальных сетях.
        </div>
      </div>
    </div>
  );
}
