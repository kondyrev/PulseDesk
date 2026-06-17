import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

const allowedStatuses = new Set([
  "new",
  "open",
  "waiting_operator",
  "waiting_customer",
  "resolved",
  "closed",
]);

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

  return membership?.workspace_id || null;
}

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

    const workspaceId = await getCurrentWorkspaceId();

    if (!workspaceId) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const existingTicket = await prisma.ticket.findFirst({
      where: {
        id,
        workspaceId,
      },
    });

    if (!existingTicket) {
      return NextResponse.json(
        { error: "Обращение не найдено" },
        { status: 404 }
      );
    }

    const ticket = await prisma.ticket.update({
      where: {
        id: existingTicket.id,
      },
      data: {
        status: status as typeof existingTicket.status,
      },
    });

    return NextResponse.json({
      ok: true,
      ticket: {
        id: ticket.id,
        status: ticket.status,
      },
    });
  } catch (error) {
    console.error("Ticket PATCH error:", error);

    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}