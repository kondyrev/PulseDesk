import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const publicWidgetKey = searchParams.get("key");

    if (!publicWidgetKey) {
      return NextResponse.json(
        { error: "Widget key is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const settings = await prisma.widgetSetting.findUnique({
      where: {
        publicWidgetKey,
      },
    });

    if (!settings || !settings.isEnabled) {
      return NextResponse.json(
        { error: "Виджет отключен или не найден" },
        { status: 403, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        settings: {
          company_name: settings.companyName || "",
          title: settings.title,
          subtitle: settings.subtitle,
          primary_color: settings.primaryColor,
          position: settings.position,
          is_enabled: settings.isEnabled,
        },
      },
      { headers: corsHeaders }
    );
  } catch {
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500, headers: corsHeaders }
    );
  }
}