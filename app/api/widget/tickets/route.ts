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

    const {
      publicWidgetKey,
      ticketId,
      customerEmail,
      customerName,
      message,
      pageUrl,
    } = body;

    const cleanMessage = message?.trim();

    if (!publicWidgetKey || !cleanMessage) {
      return NextResponse.json(
        {
          ok: false,
          error: "Не заполнены обязательные поля",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const supabase = createAdminClient();

    const { data: widgetSettings, error: widgetError } =
      await supabase
        .from("widget_settings")
        .select("workspace_id, is_enabled")
        .eq("public_widget_key", publicWidgetKey)
        .single();

    if (widgetError || !widgetSettings?.is_enabled) {
      return NextResponse.json(
        {
          ok: false,
          error: "Виджет отключен или не найден",
        },
        {
          status: 403,
          headers: corsHeaders,
        }
      );
    }

    const workspaceId = widgetSettings.workspace_id;

    let finalTicketId = ticketId;

    if (finalTicketId) {
      const { data: existingTicket } = await supabase
        .from("tickets")
        .select("id")
        .eq("id", finalTicketId)
        .eq("workspace_id", workspaceId)
        .single();

      if (!existingTicket) {
        finalTicketId = null;
      }
    }

    if (!finalTicketId) {
      const title =
        cleanMessage.length > 80
          ? `${cleanMessage.slice(0, 80)}...`
          : cleanMessage;

      const { data: ticket, error: ticketError } =
        await supabase
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
          {
            ok: false,
            error:
              ticketError?.message ||
              "Не удалось создать обращение",
          },
          {
            status: 500,
            headers: corsHeaders,
          }
        );
      }

      finalTicketId = ticket.id;
    }

    const { error: messageError } = await supabase
      .from("ticket_messages")
      .insert({
        ticket_id: finalTicketId,
        workspace_id: workspaceId,
        sender_type: "customer",
        customer_email: customerEmail || null,
        content: cleanMessage,
        page_url: pageUrl || null,
      });

    if (messageError) {
      return NextResponse.json(
        {
          ok: false,
          error: messageError.message,
        },
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        ticketId: finalTicketId,
      },
      {
        headers: corsHeaders,
      }
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Некорректный запрос",
      },
      {
        status: 400,
        headers: corsHeaders,
      }
    );
  }
}