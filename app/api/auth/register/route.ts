import { randomBytes } from "crypto";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE_NAME } from "@/lib/auth";

function createWorkspaceName(email: string) {
  const name = email.split("@")[0]?.trim();

  if (!name) {
    return "Моё рабочее пространство";
  }

  return `Рабочее пространство ${name}`;
}

function createPublicKey() {
  return `qr_${randomBytes(24).toString("hex")}`;
}

function createSessionToken() {
  return randomBytes(32).toString("hex");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Укажите email и пароль" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Пароль должен быть не короче 8 символов" },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Пользователь с такой почтой уже существует" },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const publicWidgetKey = randomBytes(24).toString("hex");
    const qrPublicKey = createPublicKey();

    const sessionToken = createSessionToken();
    const sessionExpiresAt = new Date();
    sessionExpiresAt.setDate(sessionExpiresAt.getDate() + 30);

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

      const qrCode = await tx.qrCode.create({
        data: {
          workspaceId: workspace.id,
          publicKey: qrPublicKey,
          title: "Основной QR-код",
          description: "Главный QR-код для приёма обращений от клиентов.",
          isPrimary: true,
          isActive: true,
        },
        select: {
          id: true,
          publicKey: true,
        },
      });

      const businessStartIntent = await tx.intent.findUnique({
        where: {
          code: "business_start",
        },
        select: {
          id: true,
          categoryId: true,
        },
      });

      await tx.partnerEvent.create({
        data: {
          workspaceId: workspace.id,
          userId: user.id,
          eventType: "intent_detected",
          intentId: businessStartIntent?.id,
          categoryId: businessStartIntent?.categoryId,
          intentCode: "business_start",
          categoryCode: "business_start",
          placementCode: "registration",
          source: "registration",
          metadata: {
            reason: "workspace_created",
            qrCodeId: qrCode.id,
            qrPublicKey: qrCode.publicKey,
          },
        },
      });

      await tx.session.create({
        data: {
          userId: user.id,
          token: sessionToken,
          expiresAt: sessionExpiresAt,
        },
      });

      return {
        user,
        workspace,
        qrCode,
      };
    });

    const response = NextResponse.json(
      {
        success: true,
        userId: result.user.id,
        email: result.user.email,
        workspaceId: result.workspace.id,
        workspaceName: result.workspace.name,
        qrPublicKey: result.qrCode.publicKey,
        redirectTo: "/welcome",
      },
      { status: 201 },
    );

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: sessionExpiresAt,
    });

    return response;
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}