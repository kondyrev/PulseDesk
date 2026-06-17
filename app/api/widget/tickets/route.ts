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

    const publicWidgetKey = String(body.publicWidgetKey || "").trim();
    const ticketId = body.ticketId ? String(body.ticketId).trim() : "";
    const customerName = String(body.customerName || "").trim();
    const customerEmail = String(body.customerEmail || "").trim();
    const message = String(body.message || "").trim();
    const pageUrl = String(body.pageUrl || "").trim();

    if (!publicWidgetKey || !message) {
      return NextResponse.json(
        { error: "widget key and message are required" },
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

    if (ticketId) {
      const { data: ticket, error: ticketError } = await supabase
        .from("tickets")
        .select("id, status")
        .eq("id", ticketId)
        .eq("workspace_id", workspaceId)
        .single();

      if (ticketError || !ticket) {
        return NextResponse.json(
          { error: "Обращение не найдено" },
          { status: 404, headers: corsHeaders }
        );
      }

      if (ticket.status === "closed") {
        return NextResponse.json(
          {
            error:
              "Обращение уже закрыто. Пожалуйста, создайте новое обращение.",
            closed: true,
          },
          { status: 400, headers: corsHeaders }
        );
      }

      const { data: createdMessage, error: messageError } = await supabase
        .from("ticket_messages")
        .insert({
          workspace_id: workspaceId,
          ticket_id: ticket.id,
          sender_type: "customer",
          content: message,
          page_url: pageUrl || null,
        })
        .select("id, sender_type, content, created_at")
        .single();

      if (messageError) {
        return NextResponse.json(
          { error: messageError.message },
          { status: 500, headers: corsHeaders }
        );
      }

      await supabase
        .from("tickets")
        .update({
          status: "waiting_operator",
        })
        .eq("id", ticket.id)
        .eq("workspace_id", workspaceId);

      return NextResponse.json(
        {
          ok: true,
          ticketId: ticket.id,
          message: createdMessage,
        },
        { headers: corsHeaders }
      );
    }

    const title = message.length > 80 ? `${message.slice(0, 80)}...` : message;

    const { data: ticket, error: ticketCreateError } = await supabase
      .from("tickets")
      .insert({
        workspace_id: workspaceId,
        title,
        customer_name: customerName || null,
        customer_email: customerEmail || null,
        status: "new",
        priority: "normal",
        source: "widget",
      })
      .select("id")
      .single();

    if (ticketCreateError || !ticket) {
      return NextResponse.json(
        { error: ticketCreateError?.message || "Не удалось создать обращение" },
        { status: 500, headers: corsHeaders }
      );
    }

    const { error: messageCreateError } = await supabase
      .from("ticket_messages")
      .insert({
        workspace_id: workspaceId,
        ticket_id: ticket.id,
        sender_type: "customer",
        content: message,
        page_url: pageUrl || null,
      });

    if (messageCreateError) {
      return NextResponse.json(
        { error: messageCreateError.message },
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
      { error: "Ошибка сервера" },
      { status: 500, headers: corsHeaders }
    );
  }
}