import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const membership = await prisma.workspaceMember.findFirst({
    where: {
      userId: user.id,
    },
    select: {
      workspaceId: true,
    },
  });

  return membership?.workspaceId || null;
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