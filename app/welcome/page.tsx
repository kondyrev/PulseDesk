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
  Printer,
  QrCode,
  Send,
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
  )}&size=360&margin=2`;

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-6 py-8 text-black">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-6xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[44px] border border-black/[0.04] bg-white p-8 shadow-sm md:p-12">
            <div className="mb-10 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              <Check className="h-4 w-4" />
              ПУЛЬС готов к работе
            </div>

            <h1 className="max-w-2xl text-5xl font-black tracking-tight md:text-6xl">
              Ваш QR-код готов.
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-500">
              Теперь клиенты могут отправить обращение за одно сканирование.
              Разместите QR-код на визитке, в сообщении, на автомобиле или в
              мастерской.
            </p>

            <div className="mt-10 rounded-[32px] border border-black/[0.06] bg-[#f8f8fa] p-5">
              <div className="rounded-[28px] bg-white p-6 shadow-sm">
                <div className="mx-auto flex max-w-[360px] justify-center">
                  <img
                    src={qrImageUrl}
                    alt="Персональный QR-код ПУЛЬС"
                    className="h-auto w-full rounded-3xl"
                  />
                </div>

                <div className="mt-5 rounded-2xl bg-zinc-50 px-4 py-3 text-center text-sm font-medium text-zinc-600">
                  {qrUrl}
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <a
                href={qrImageUrl}
                target="_blank"
                rel="noreferrer"
                className="flex h-13 items-center justify-center gap-2 rounded-2xl bg-black px-4 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
              >
                <Download className="h-4 w-4" />
                Скачать QR
              </a>

              <a
                href={qrUrl}
                target="_blank"
                rel="noreferrer"
                className="flex h-13 items-center justify-center gap-2 rounded-2xl border border-black/[0.08] bg-white px-4 text-sm font-semibold transition hover:bg-zinc-50"
              >
                <Copy className="h-4 w-4" />
                Открыть ссылку
              </a>

              <Link
                href="/dashboard"
                className="flex h-13 items-center justify-center gap-2 rounded-2xl border border-black/[0.08] bg-white px-4 text-sm font-semibold transition hover:bg-zinc-50"
              >
                Мой ПУЛЬС
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          <aside className="rounded-[44px] border border-black/[0.04] bg-black p-8 text-white shadow-sm md:p-10">
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-3xl bg-white text-black">
              <QrCode className="h-7 w-7" />
            </div>

            <h2 className="text-3xl font-black tracking-tight">
              Что теперь?
            </h2>

            <p className="mt-3 leading-7 text-white/60">
              ПУЛЬС уже подготовил первую точку входа для ваших клиентов.
            </p>

            <div className="mt-10 space-y-4">
              <div className="flex gap-4 rounded-3xl bg-white/[0.06] p-5">
                <Printer className="mt-1 h-5 w-5 shrink-0" />
                <div>
                  <div className="font-semibold">Распечатайте визитки</div>
                  <div className="mt-1 text-sm leading-6 text-white/55">
                    QR-код можно разместить на простой бумажной визитке.
                  </div>
                </div>
              </div>

              <div className="flex gap-4 rounded-3xl bg-white/[0.06] p-5">
                <Send className="mt-1 h-5 w-5 shrink-0" />
                <div>
                  <div className="font-semibold">Отправьте постоянным клиентам</div>
                  <div className="mt-1 text-sm leading-6 text-white/55">
                    Ссылку можно отправить в мессенджере или добавить в профиль.
                  </div>
                </div>
              </div>

              <div className="flex gap-4 rounded-3xl bg-white/[0.06] p-5">
                <Car className="mt-1 h-5 w-5 shrink-0" />
                <div>
                  <div className="font-semibold">Разместите на автомобиле</div>
                  <div className="mt-1 text-sm leading-6 text-white/55">
                    Клиент увидит QR-код и сможет быстро оставить обращение.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-3xl bg-white p-5 text-black">
              <div className="text-sm font-bold">Второй пилот уже на борту</div>
              <div className="mt-2 text-sm leading-6 text-zinc-500">
                Когда появится первое обращение, ПУЛЬС поможет ответить
                спокойно, быстро и профессионально.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}