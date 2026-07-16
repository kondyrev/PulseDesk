import { randomBytes } from "crypto";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import WelcomeExperience from "./WelcomeExperience";

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
          widgetSetting: true,
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
  )}&size=420&margin=2&ecLevel=H`;
  const userName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  const displayName =
    membership.workspace.widgetSetting?.companyName?.trim() ||
    userName.trim() ||
    membership.workspace.name;

  return (
    <WelcomeExperience
      businessCardData={{
        displayName,
        qrUrl,
        qrImageUrl,
      }}
      qrUrl={qrUrl}
      qrImageUrl={qrImageUrl}
    />
  );
}
