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

const allowedPriorities = new Set(["low", "normal", "high", "urgent"]);

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

    const status = body.status ? String(body.status) : null;
    const priority = body.priority ? String(body.priority) : null;

    if (!status && !priority) {
      return NextResponse.json(
        { error: "Нет данных для обновления." },
        { status: 400 }
      );
    }

    if (status && !allowedStatuses.has(status)) {
      return NextResponse.json(
        { error: "Некорректный статус обращения." },
        { status: 400 }
      );
    }

    if (priority && !allowedPriorities.has(priority)) {
      return NextResponse.json(
        { error: "Некорректный приоритет обращения." },
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
        ...(status ? { status: status as typeof existingTicket.status } : {}),
        ...(priority
          ? { priority: priority as typeof existingTicket.priority }
          : {}),
      },
    });

    return NextResponse.json({
      ok: true,
      ticket: {
        id: ticket.id,
        status: ticket.status,
        priority: ticket.priority,
      },
    });
  } catch (error) {
    console.error("Ticket PATCH error:", error);

    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}