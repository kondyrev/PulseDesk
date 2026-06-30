"use client";

export default function ModernBusinessCardPreview() {
  return (
    <div className="flex h-28 w-full flex-col justify-between rounded-2xl bg-black p-3 text-white shadow-sm">
      <div>
        <div className="h-2 w-16 rounded-full bg-white" />
        <div className="mt-2 h-1.5 w-24 rounded-full bg-white/45" />
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="h-1.5 w-20 rounded-full bg-white/70" />
          <div className="mt-1.5 h-1.5 w-14 rounded-full bg-emerald-300" />
        </div>

        <div className="grid h-12 w-12 grid-cols-3 gap-0.5 rounded-lg bg-white p-1">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className={[
                "rounded-[2px]",
                index % 2 === 0 ? "bg-black" : "bg-zinc-300",
              ].join(" ")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}