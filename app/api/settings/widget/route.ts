import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function normalizeColor(value: string) {
  const color = value.trim();

  if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
    return color;
  }

  return "#000000";
}

function normalizePosition(value: string) {
  return value === "bottom_left" ? "bottom_left" : "bottom_right";
}

async function getCurrentWorkspaceId() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const membership = await prisma.workspaceMember.findFirst({
    where: {
      userId: user.id,
    },
    select: {
      workspaceId: true,
    },
  });

  return membership?.workspaceId || null;
}

export async function GET() {
  try {
    const workspaceId = await getCurrentWorkspaceId();

    if (!workspaceId) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const settings = await prisma.widgetSetting.upsert({
      where: {
        workspaceId,
      },
      update: {},
      create: {
        workspaceId,
        publicWidgetKey: `pwd_${randomUUID()}`,
        isEnabled: true,
        companyName: "",
        title: "Поддержка",
        subtitle: "Обычно отвечаем в течение нескольких минут",
        primaryColor: "#000000",
        position: "bottom_right",
      },
    });

    return NextResponse.json({
      ok: true,
      settings,
    });
  } catch (error) {
    console.error("GET WIDGET SETTINGS ERROR:", error);

    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const workspaceId = await getCurrentWorkspaceId();

    if (!workspaceId) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const body = await request.json();

    const companyName = String(body.companyName || "").trim();
    const title = String(body.title || "Поддержка").trim();
    const subtitle = String(
      body.subtitle || "Обычно отвечаем в течение нескольких минут"
    ).trim();

    const primaryColor = normalizeColor(String(body.primaryColor || ""));
    const position = normalizePosition(String(body.position || ""));
    const isEnabled = Boolean(body.isEnabled);

    const existingSettings = await prisma.widgetSetting.findUnique({
      where: {
        workspaceId,
      },
    });

    const settings = await prisma.widgetSetting.upsert({
      where: {
        workspaceId,
      },
      update: {
        companyName,
        title,
        subtitle,
        primaryColor,
        position,
        isEnabled,
      },
      create: {
        workspaceId,
        publicWidgetKey:
          existingSettings?.publicWidgetKey || `pwd_${randomUUID()}`,
        companyName,
        title,
        subtitle,
        primaryColor,
        position,
        isEnabled,
      },
    });

    return NextResponse.json({
      ok: true,
      settings,
    });
  } catch (error) {
    console.error("PATCH WIDGET SETTINGS ERROR:", error);

    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}