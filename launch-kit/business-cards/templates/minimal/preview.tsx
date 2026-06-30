"use client";

export default function MinimalBusinessCardPreview() {
  return (
    <div className="flex h-28 w-full items-center justify-between rounded-2xl border border-black/10 bg-white p-3 shadow-sm">
      <div>
        <div className="h-2 w-20 rounded-full bg-black" />
        <div className="mt-2 h-1.5 w-28 rounded-full bg-zinc-300" />
        <div className="mt-1.5 h-1.5 w-16 rounded-full bg-zinc-200" />
      </div>

      <div className="grid h-14 w-14 grid-cols-3 gap-0.5 rounded-xl border border-black/10 bg-white p-1.5">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className={[
              "rounded-[2px]",
              index % 3 === 0 ? "bg-black" : "bg-zinc-200",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}