"use client";

type Props = {
  qrImageUrl: string;
  qrUrl: string;
};

export default function BusinessCardReadyPreview({ qrImageUrl, qrUrl }: Props) {
  return (
    <div className="rounded-[28px] border border-black/[0.06] bg-zinc-50 p-4">
      <div className="rounded-[24px] bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
        <div className="mx-auto flex aspect-[1.75/1] max-w-md flex-col items-center justify-between rounded-[22px] border border-black/[0.08] bg-white p-6 text-center">
          <div>
            <div className="text-2xl font-black tracking-tight">Ваша визитка</div>
            <div className="mt-1 text-sm font-medium text-zinc-500">
              для будущих клиентов
            </div>
          </div>

          <img
            src={qrImageUrl}
            alt="QR-код для визитки"
            className="h-32 w-32"
          />

          <div>
            <div className="text-sm font-black">
              Наведите камеру телефона
            </div>
            <div className="mt-1 text-xs leading-5 text-zinc-500">
              и оставьте обращение
            </div>
          </div>
        </div>

        <div className="mt-4 truncate rounded-2xl bg-zinc-50 px-4 py-3 text-center text-xs text-zinc-500">
          {qrUrl}
        </div>
      </div>
    </div>
  );
}