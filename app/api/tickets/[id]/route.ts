import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

const allowedStatuses = new Set([
  "new",
  "waiting_operator",
  "waiting_customer",
  "closed",
]);

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const status = String(body.status || "");

    if (!allowedStatuses.has(status)) {
      return NextResponse.json(
        { error: "Некорректный статус обращения." },
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

    const { data: ticket, error } = await supabase
      .from("tickets")
      .update({ status })
      .eq("id", id)
      .eq("workspace_id", membership.workspace_id)
      .select("id, status")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!ticket) {
      return NextResponse.json(
        { error: "Обращение не найдено" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      ticket,
    });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}