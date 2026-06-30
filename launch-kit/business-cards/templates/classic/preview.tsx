"use client";

export default function ClassicBusinessCardPreview() {
  return (
    <div className="flex h-28 w-full flex-col justify-between rounded-2xl border border-zinc-300 bg-[#fbfaf7] p-3 shadow-sm">
      <div className="border-b border-zinc-300 pb-2">
        <div className="h-2 w-24 rounded-full bg-zinc-900" />
        <div className="mt-2 h-1.5 w-16 rounded-full bg-zinc-400" />
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="h-1.5 w-24 rounded-full bg-zinc-500" />
          <div className="mt-1.5 h-1.5 w-20 rounded-full bg-zinc-300" />
        </div>

        <div className="grid h-11 w-11 grid-cols-3 gap-0.5 rounded-md border border-zinc-400 bg-white p-1">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className={[
                "rounded-[1px]",
                index === 4 || index % 2 === 0 ? "bg-zinc-900" : "bg-zinc-300",
              ].join(" ")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}