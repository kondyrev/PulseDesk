import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const content = String(body.content || "").trim();

    if (!content) {
      return NextResponse.json(
        { error: "Сообщение не может быть пустым." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { data: membership } = await supabase
      .from("workspace_members")
      .select("workspace_id")
      .eq("profile_id", user.id)
      .single();

    if (!membership) {
      return NextResponse.json(
        { error: "Рабочее пространство не найдено" },
        { status: 403 }
      );
    }

    const workspaceId = membership.workspace_id;

    const { data: ticket, error: ticketError } = await supabase
      .from("tickets")
      .select("id, status")
      .eq("id", id)
      .eq("workspace_id", workspaceId)
      .single();

    if (ticketError || !ticket) {
      return NextResponse.json(
        { error: "Обращение не найдено." },
        { status: 404 }
      );
    }

    if (ticket.status === "closed") {
      return NextResponse.json(
        { error: "Обращение закрыто. Новые ответы недоступны." },
        { status: 400 }
      );
    }

    const { data: message, error: messageError } = await supabase
      .from("ticket_messages")
      .insert({
        ticket_id: ticket.id,
        workspace_id: workspaceId,
        sender_type: "operator",
        content,
      })
      .select("id, sender_type, content, page_url, created_at")
      .single();

    if (messageError) {
      return NextResponse.json(
        { error: messageError.message },
        { status: 500 }
      );
    }

    await supabase
      .from("tickets")
      .update({
        status: "waiting_customer",
      })
      .eq("id", ticket.id)
      .eq("workspace_id", workspaceId);

    return NextResponse.json({
      ok: true,
      message,
    });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}