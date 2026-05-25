import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-4xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
        <div className="mb-6 text-sm font-medium uppercase tracking-[0.3em] text-zinc-400">
          {eyebrow}
        </div>
      ) : null}

      <h2 className="text-5xl font-black leading-[0.95] tracking-[-0.05em] text-black md:text-7xl">
        {title}
      </h2>

      {description ? (
        <p className="mt-8 max-w-3xl text-2xl leading-relaxed text-zinc-500">
          {description}
        </p>
      ) : null}
    </div>
  );
}