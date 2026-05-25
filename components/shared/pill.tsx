import { cn } from "@/lib/utils";

export function Pill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold",
        className
      )}
    >
      {children}
    </span>
  );
}