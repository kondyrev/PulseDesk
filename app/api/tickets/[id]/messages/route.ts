import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

export async function GET(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;
    const workspaceId = await getCurrentWorkspaceId();

    if (!workspaceId) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const ticket = await prisma.ticket.findFirst({
      where: {
        id,
        workspaceId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: "Обращение не найдено." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      messages: ticket.messages.map((message) => ({
        id: message.id,
        sender_type: message.senderType,
        content: message.content,
        page_url: message.pageUrl,
        created_at: message.createdAt,
      })),
    });
  } catch (error) {
    console.error("Ticket messages GET error:", error);

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

    const content = String(body.content || "").trim();

    if (!content) {
      return NextResponse.json(
        { error: "Сообщение не может быть пустым." },
        { status: 400 }
      );
    }

    const workspaceId = await getCurrentWorkspaceId();

    if (!workspaceId) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const ticket = await prisma.ticket.findFirst({
      where: {
        id,
        workspaceId,
      },
    });

    if (!ticket) {
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

    const message = await prisma.ticketMessage.create({
      data: {
        ticketId: ticket.id,
        senderType: "operator",
        content,
      },
    });

    await prisma.ticket.update({
      where: {
        id: ticket.id,
      },
      data: {
        status: "waiting_customer",
      },
    });

    return NextResponse.json({
      ok: true,
      message: {
        id: message.id,
        sender_type: message.senderType,
        content: message.content,
        page_url: message.pageUrl,
        created_at: message.createdAt,
      },
    });
  } catch (error) {
    console.error("Ticket messages POST error:", error);

    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}