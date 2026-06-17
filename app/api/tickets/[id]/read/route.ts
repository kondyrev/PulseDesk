import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

async function getCurrentUserAndWorkspace() {
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

  if (!membership?.workspace_id) {
    return null;
  }

  return {
    userId: user.id,
    workspaceId: membership.workspace_id as string,
  };
}

export async function POST(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;
    const current = await getCurrentUserAndWorkspace();

    if (!current) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const ticket = await prisma.ticket.findFirst({
      where: {
        id,
        workspaceId: current.workspaceId,
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: "Обращение не найдено" },
        { status: 404 }
      );
    }

    await prisma.ticketReadState.upsert({
      where: {
        ticketId_userId: {
          ticketId: ticket.id,
          userId: current.userId,
        },
      },
      update: {
        lastReadAt: new Date(),
      },
      create: {
        ticketId: ticket.id,
        userId: current.userId,
        lastReadAt: new Date(),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Ticket read state error:", error);

    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}