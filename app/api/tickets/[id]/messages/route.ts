import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

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
      return NextResponse.json({ error: "Рабочее пространство не найдено" }, { status: 403 });
    }

    const { data: ticket } = await supabase
      .from("tickets")
      .select("id")
      .eq("id", id)
      .eq("workspace_id", membership.workspace_id)
      .single();

    if (!ticket) {
      return NextResponse.json({ error: "Обращение не найдено" }, { status: 404 });
    }

    const { data: messages, error } = await supabase
      .from("ticket_messages")
      .select("id, sender_type, content, page_url, created_at")
      .eq("ticket_id", id)
      .eq("workspace_id", membership.workspace_id)
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      messages: messages || [],
    });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const content = body.content?.trim();

    if (!content) {
      return NextResponse.json({ error: "Сообщение пустое" }, { status: 400 });
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
      return NextResponse.json({ error: "Рабочее пространство не найдено" }, { status: 403 });
    }

    const workspaceId = membership.workspace_id;

    const { data: ticket } = await supabase
      .from("tickets")
      .select("id")
      .eq("id", id)
      .eq("workspace_id", workspaceId)
      .single();

    if (!ticket) {
      return NextResponse.json({ error: "Обращение не найдено" }, { status: 404 });
    }

    const { error } = await supabase.from("ticket_messages").insert({
      ticket_id: ticket.id,
      workspace_id: workspaceId,
      sender_type: "operator",
      sender_profile_id: user.id,
      content,
    });

    await supabase
      .from("tickets")
      .update({
        last_message_at: new Date().toISOString(),
        last_operator_message_at: new Date().toISOString(),
      })
      .eq("id", ticket.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}