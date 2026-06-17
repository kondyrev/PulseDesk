import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const { searchParams } = new URL(request.url);
    const publicWidgetKey = searchParams.get("key");

    if (!id || !publicWidgetKey) {
      return NextResponse.json(
        { error: "ticketId and widget key are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const widgetSettings = await prisma.widgetSetting.findUnique({
      where: { publicWidgetKey },
    });

    if (!widgetSettings || !widgetSettings.isEnabled) {
      return NextResponse.json(
        { error: "Виджет отключен или не найден" },
        { status: 403, headers: corsHeaders }
      );
    }

    const ticket = await prisma.ticket.findFirst({
      where: {
        id,
        workspaceId: widgetSettings.workspaceId,
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
        { error: "Обращение не найдено" },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        closed: ticket.status === "closed",
        messages: ticket.messages.map((message) => ({
          id: message.id,
          sender_type: message.senderType,
          content: message.content,
          created_at: message.createdAt,
        })),
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Widget messages error:", error);

    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500, headers: corsHeaders }
    );
  }
}