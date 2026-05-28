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

export async function GET(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const { searchParams } = new URL(request.url);
    const publicWidgetKey = searchParams.get("key");

    if (!id || !publicWidgetKey) {
      return NextResponse.json(
        { error: "ticketId and widget key are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const supabase = createAdminClient();

    const { data: widgetSettings, error: widgetError } = await supabase
      .from("widget_settings")
      .select("workspace_id, is_enabled")
      .eq("public_widget_key", publicWidgetKey)
      .single();

    if (widgetError || !widgetSettings?.is_enabled) {
      return NextResponse.json(
        { error: "Виджет отключен или не найден" },
        { status: 403, headers: corsHeaders }
      );
    }

    const workspaceId = widgetSettings.workspace_id;

    const { data: ticket, error: ticketError } = await supabase
      .from("tickets")
      .select("id")
      .eq("id", id)
      .eq("workspace_id", workspaceId)
      .single();

    if (ticketError || !ticket) {
      return NextResponse.json(
        { error: "Обращение не найдено" },
        { status: 404, headers: corsHeaders }
      );
    }

    const { data: messages, error: messagesError } = await supabase
      .from("ticket_messages")
      .select("id, sender_type, content, created_at")
      .eq("ticket_id", id)
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: true });

    if (messagesError) {
      return NextResponse.json(
        { error: messagesError.message },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        messages: messages || [],
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