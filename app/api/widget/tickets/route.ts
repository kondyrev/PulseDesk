import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { publicWidgetKey, customerEmail, customerName, message, pageUrl } =
      body;

    if (!publicWidgetKey || !message?.trim()) {
      return NextResponse.json(
        { error: "Не заполнены обязательные поля" },
        { status: 400, headers: corsHeaders }
      );
    }

    const supabase = createAdminClient();

    const { data: widgetSettings, error: widgetError } = await supabase
      .from("widget_settings")
      .select("workspace_id, is_enabled, allowed_domains")
      .eq("public_widget_key", publicWidgetKey)
      .single();

    if (widgetError || !widgetSettings?.is_enabled) {
      return NextResponse.json(
        { error: "Виджет отключен или не найден" },
        { status: 403, headers: corsHeaders }
      );
    }

    const workspaceId = widgetSettings.workspace_id;

    const title =
      message.trim().length > 80
        ? `${message.trim().slice(0, 80)}...`
        : message.trim();

    const { data: ticket, error: ticketError } = await supabase
      .from("tickets")
      .insert({
        workspace_id: workspaceId,
        title,
        customer_email: customerEmail || null,
        customer_name: customerName || null,
        source: "widget",
        status: "new",
        priority: "normal",
      })
      .select("id")
      .single();

    if (ticketError || !ticket) {
      return NextResponse.json(
        { error: ticketError?.message || "Не удалось создать тикет" },
        { status: 500, headers: corsHeaders }
      );
    }

    const messageContent = pageUrl
      ? `${message.trim()}\n\nСтраница: ${pageUrl}`
      : message.trim();

    const { error: messageError } = await supabase
      .from("ticket_messages")
      .insert({
        ticket_id: ticket.id,
        workspace_id: workspaceId,
        sender_type: "customer",
        customer_email: customerEmail || null,
        content: messageContent,
      });

    if (messageError) {
      return NextResponse.json(
        { error: messageError.message },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        ticketId: ticket.id,
      },
      { headers: corsHeaders }
    );
  } catch {
    return NextResponse.json(
      { error: "Некорректный запрос" },
      { status: 400, headers: corsHeaders }
    );
  }
}