import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

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

    const widgetSettings = await prisma.widgetSetting.findUnique({
      where: { publicWidgetKey },
    });

    if (!widgetSettings || !widgetSettings.isEnabled) {
      return NextResponse.json(
        { error: "Виджет отключен или не найден" },
        { status: 403, headers: corsHeaders }
      );
    }

    if (ticketId) {
      const ticket = await prisma.ticket.findFirst({
        where: {
          id: ticketId,
          workspaceId: widgetSettings.workspaceId,
        },
      });

      if (!ticket) {
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

      const createdMessage = await prisma.ticketMessage.create({
        data: {
          ticketId: ticket.id,
          senderType: "customer",
          content: message,
          pageUrl: pageUrl || null,
        },
      });

      await prisma.ticket.update({
        where: { id: ticket.id },
        data: {
          status: "waiting_operator",
        },
      });

      return NextResponse.json(
        {
          ok: true,
          ticketId: ticket.id,
          message: {
            id: createdMessage.id,
            sender_type: createdMessage.senderType,
            content: createdMessage.content,
            created_at: createdMessage.createdAt,
          },
        },
        { headers: corsHeaders }
      );
    }

    const title = message.length > 80 ? `${message.slice(0, 80)}...` : message;

    const ticket = await prisma.ticket.create({
      data: {
        workspaceId: widgetSettings.workspaceId,
        title,
        customerName: customerName || null,
        customerEmail: customerEmail || null,
        status: "new",
        priority: "normal",
        source: "widget",
        messages: {
          create: {
            senderType: "customer",
            content: message,
            pageUrl: pageUrl || null,
          },
        },
      },
    });

    return NextResponse.json(
      {
        ok: true,
        ticketId: ticket.id,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Widget ticket error:", error);

    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500, headers: corsHeaders }
    );
  }
}