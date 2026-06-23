import { randomBytes } from "crypto";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

function createWorkspaceName(email: string) {
  const name = email.split("@")[0]?.trim();

  if (!name) {
    return "Моё рабочее пространство";
  }

  return `Рабочее пространство ${name}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Укажите email и пароль" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Пароль должен быть не короче 8 символов" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Пользователь с такой почтой уже существует" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const publicWidgetKey = randomBytes(24).toString("hex");

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
        },
        select: {
          id: true,
          email: true,
        },
      });

      const workspace = await tx.workspace.create({
        data: {
          name: createWorkspaceName(email),
        },
        select: {
          id: true,
          name: true,
        },
      });

      await tx.workspaceMember.create({
        data: {
          userId: user.id,
          workspaceId: workspace.id,
          role: "owner",
        },
      });

      await tx.widgetSetting.create({
        data: {
          workspaceId: workspace.id,
          publicWidgetKey,
          companyName: workspace.name,
        },
      });

      return {
        user,
        workspace,
      };
    });

    return NextResponse.json(
      {
        success: true,
        userId: result.user.id,
        email: result.user.email,
        workspaceId: result.workspace.id,
        workspaceName: result.workspace.name,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}