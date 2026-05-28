import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

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
        { ok: false, error: "Ключ виджета не указан" },
        { status: 400, headers: corsHeaders }
      );
    }

    const supabase = createAdminClient();

    const { data: settings, error } = await supabase
      .from("widget_settings")
      .select(
        `
        company_name,
        title,
        subtitle,
        welcome_message,
        primary_color,
        is_enabled
      `
      )
      .eq("public_widget_key", publicWidgetKey)
      .single();

    if (error || !settings?.is_enabled) {
      return NextResponse.json(
        { ok: false, error: "Виджет отключен или не найден" },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        settings,
      },
      { headers: corsHeaders }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Ошибка сервера" },
      { status: 500, headers: corsHeaders }
    );
  }
}