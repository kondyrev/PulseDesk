import { cn } from "@/lib/utils";

export function PremiumCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[32px] border border-black/[0.04] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl",
        className
      )}
    >
      {children}
    </div>
  );
}