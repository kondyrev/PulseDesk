import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  muted,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  muted?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-32",
        muted
          ? "bg-[#f5f5f7] border-t border-black/[0.04]"
          : "bg-white border-t border-black/[0.04]",
        className
      )}
    >
      {children}
    </section>
  );
}