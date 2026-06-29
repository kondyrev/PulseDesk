import { randomBytes } from "crypto";

import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Car,
  Check,
  Copy,
  Download,
  Heart,
  Printer,
  QrCode,
  Send,
  Sparkles,
  Users,
} from "lucide-react";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function createPublicKey() {
  return `qr_${randomBytes(24).toString("hex")}`;
}

async function getAppUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  const headersList = await headers();

  const host =
    headersList.get("x-forwarded-host") ||
    headersList.get("host") ||
    "localhost:3000";

  const protocol =
    headersList.get("x-forwarded-proto") ||
    (host.includes("localhost") ? "http" : "https");

  return `${protocol}://${host}`;
}

export default async function WelcomePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const membership = await prisma.workspaceMember.findFirst({
    where: {
      userId: user.id,
    },
    include: {
      workspace: {
        include: {
          qrCodes: {
            where: {
              isPrimary: true,
            },
            orderBy: {
              createdAt: "asc",
            },
            take: 1,
          },
        },
      },
    },
  });

  if (!membership) {
    redirect("/signup");
  }

  let qrCode = membership.workspace.qrCodes[0];

  if (!qrCode) {
    qrCode = await prisma.qrCode.create({
      data: {
        workspaceId: membership.workspace.id,
        publicKey: createPublicKey(),
        title: "Основной QR-код",
        description: "Главный QR-код для приёма обращений от клиентов.",
        isPrimary: true,
        isActive: true,
      },
    });
  }

  const appUrl = await getAppUrl();
  const qrUrl = `${appUrl}/q/${qrCode.publicKey}`;
  const qrImageUrl = `https://quickchart.io/qr?text=${encodeURIComponent(
    qrUrl,
  )}&size=460&margin=2`;

  return (
    <main className="min-h-screen bg-[#f4f5f7] px-5 py-6 text-black md:px-8 md:py-8">
      <div className="mx-auto grid w-full max-w-7xl gap-7 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="rounded-[44px] border border-black/[0.04] bg-white p-7 shadow-sm md:p-10 lg:p-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
            <Sparkles className="h-4 w-4" />
            Поздравляем!
          </div>

          <h1 className="mt-10 max-w-2xl text-5xl font-black leading-[1.05] tracking-tight md:text-6xl">
            Теперь вы готовы{" "}
            <span className="text-emerald-500">принимать</span> обращения.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-500">
            Мы уже создали для вас персональный QR-код. Покажите его будущим
            клиентам — и первое обращение может прийти уже сегодня.
          </p>

          <div className="mt-10 rounded-[34px] border border-black/[0.06] bg-[#f8f8fa] p-5">
            <div className="rounded-[30px] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.08)] md:p-8">
              <div className="mx-auto flex max-w-[460px] justify-center">
                <img
                  src={qrImageUrl}
                  alt="Персональный QR-код ПУЛЬС"
                  className="h-auto w-full rounded-3xl"
                />
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-center text-sm font-medium text-zinc-500">
                <QrCode className="h-4 w-4" />
                Это ваша персональная ссылка для клиентов
              </div>

              <a
                href={qrUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 flex h-14 items-center justify-center gap-2 rounded-2xl border border-black/[0.06] bg-white px-5 text-sm font-bold shadow-sm transition hover:bg-zinc-50"
              >
                <Copy className="h-4 w-4" />
                Скопировать ссылку
              </a>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <a
              href={qrImageUrl}
              target="_blank"
              rel="noreferrer"
              className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-black px-4 text-sm font-bold text-white shadow-xl shadow-black/10 transition hover:opacity-90"
            >
              <Download className="h-4 w-4" />
              Скачать QR
            </a>

            <a
              href={qrUrl}
              target="_blank"
              rel="noreferrer"
              className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-black/[0.08] bg-white px-4 text-sm font-bold transition hover:bg-zinc-50"
            >
              <Copy className="h-4 w-4" />
              Копировать ссылку
            </a>

            <Link
              href="/dashboard"
              className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-black/[0.08] bg-white px-4 text-sm font-bold transition hover:bg-zinc-50"
            >
              Начать работу
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 rounded-[28px] border border-emerald-100 bg-emerald-50/70 p-6">
            <div className="flex gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-500 shadow-sm">
                <Heart className="h-7 w-7 fill-emerald-500/15" />
              </div>

              <div>
                <div className="font-black">
                  Сегодня у вас появился первый инструмент
                </div>
                <p className="mt-2 max-w-xl leading-7 text-zinc-600">
                  Для общения с будущими клиентами. Используйте его — и ваше
                  дело начнёт двигаться вперёд.
                </p>
              </div>
            </div>
          </div>
        </section>

        <aside className="rounded-[44px] border border-white/10 bg-[#050607] p-7 text-white shadow-sm md:p-10">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white text-black">
              <Sparkles className="h-7 w-7" />
            </div>

            <div>
              <h2 className="text-3xl font-black tracking-tight">
                Ваши первые шаги
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/55">
                Несколько простых действий — и вы на старте.
              </p>
            </div>
          </div>

          <div className="mt-9 space-y-4">
            {[
              {
                number: "1",
                icon: Printer,
                title: "Распечатайте визитки",
                text: "Разместите QR-код на визитках или листовках.",
              },
              {
                number: "2",
                icon: Send,
                title: "Добавьте QR в Telegram",
                text: "Отправьте ссылку в мессенджере или закрепите в профиле.",
              },
              {
                number: "3",
                icon: Car,
                title: "Разместите QR на автомобиле",
                text: "Клиенты смогут быстро оставить обращение.",
              },
              {
                number: "4",
                icon: Users,
                title: "Отправьте ссылку клиентам",
                text: "Поделитесь ссылкой с постоянными клиентами и партнёрами.",
              },
            ].map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="group relative overflow-hidden rounded-[28px] border border-white/[0.06] bg-white/[0.06] p-5 transition hover:bg-white/[0.08]"
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-emerald-400/70" />

                  <div className="flex gap-4">
                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/[0.08]">
                      <div className="absolute -left-7 -top-7 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400 text-xs font-black text-black">
                        {step.number}
                      </div>
                      <Icon className="h-6 w-6 text-white" />
                    </div>

                    <div>
                      <div className="font-black">{step.title}</div>
                      <div className="mt-1 text-sm leading-6 text-white/55">
                        {step.text}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-9 overflow-hidden rounded-[34px] border border-emerald-400/70 bg-white/[0.04] shadow-[0_0_50px_rgba(52,211,153,0.14)]">
            <div className="relative p-6">
              <div className="absolute inset-x-0 top-0 h-28 bg-emerald-400/10 blur-2xl" />

              <div className="relative flex items-start justify-between gap-5">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-4 w-4">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-400" />
                    </span>

                    <div className="text-2xl font-black">Второй пилот</div>
                  </div>

                  <div className="mt-3 inline-flex rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-black text-emerald-300">
                    Онлайн
                  </div>
                </div>

                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_0_40px_rgba(52,211,153,0.35)]">
                  <div className="absolute inset-2 rounded-full bg-zinc-100" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#101214]">
                    <div className="absolute -left-3 top-5 h-7 w-4 rounded-l-full bg-zinc-300" />
                    <div className="absolute -right-3 top-5 h-7 w-4 rounded-r-full bg-zinc-300" />
                    <div className="flex gap-3">
                      <span className="h-3 w-3 animate-pulse rounded-full bg-emerald-400" />
                      <span className="h-3 w-3 animate-pulse rounded-full bg-emerald-400 [animation-delay:200ms]" />
                    </div>
                    <div className="absolute bottom-4 h-1.5 w-6 rounded-full bg-emerald-400/80" />
                  </div>
                </div>
              </div>

              <div className="relative mt-7 rounded-[26px] border border-white/[0.06] bg-white/[0.08] p-5">
                <div className="font-bold">Я уже здесь ✨</div>

                <p className="mt-4 text-sm leading-7 text-white/65">
                  Когда придёт первое обращение, я помогу вам:
                </p>

                <div className="mt-4 space-y-3">
                  {[
                    "понять вопрос клиента",
                    "предложить готовый ответ",
                    "подсказать, что написать",
                    "начать работу спокойно",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm text-white/75"
                    >
                      <Check className="h-4 w-4 rounded-full border border-emerald-400/40 bg-emerald-400/10 p-0.5 text-emerald-300" />
                      {item}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-3 text-sm text-white/55">
                  <span>Печатаю</span>
                  <span className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-7 flex gap-3 text-sm leading-6 text-white/55">
            <Heart className="mt-1 h-4 w-4 shrink-0" />
            <div>
              Мы рядом, когда вы нужны клиентам. ПУЛЬС — ваш помощник в работе
              и росте.
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}