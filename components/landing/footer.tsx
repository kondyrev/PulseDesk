import { Container } from "@/components/shared/container";

export function Footer() {
  return (
    <footer className="border-t border-black/[0.04] bg-white py-10">
      <Container className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-sm font-bold text-white">
            P
          </div>

          <div>
            <div className="font-bold tracking-tight">PulseDesk</div>
            <div className="text-sm text-zinc-500">
              AI-first платформа поддержки
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-zinc-500 md:text-right">
          © 2026 PulseDesk. Создано для современных SaaS-команд.
        </div>
      </Container>
    </footer>
  );
}