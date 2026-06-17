import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

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
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("profile_id", user.id)
    .single();

  if (!membership?.workspace_id) {
    return null;
  }

  return membership.workspace_id as string;
}

export async function GET() {
  try {
    const workspaceId = await getCurrentWorkspaceId();

    if (!workspaceId) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    await prisma.workspace.upsert({
      where: {
        id: workspaceId,
      },
      update: {},
      create: {
        id: workspaceId,
        name: "PulseDesk workspace",
      },
    });

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
  } catch {
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

    await prisma.workspace.upsert({
      where: {
        id: workspaceId,
      },
      update: {},
      create: {
        id: workspaceId,
        name: "PulseDesk workspace",
      },
    });

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
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}