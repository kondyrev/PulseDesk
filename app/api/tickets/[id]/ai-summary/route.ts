import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type YandexCompletionResponse = {
  result?: {
    alternatives?: Array<{
      message?: {
        text?: string;
      };
    }>;
  };
};

async function getCurrentWorkspaceId() {
  const user = await getCurrentUser();

  if (!user) return null;

  const membership = await prisma.workspaceMember.findFirst({
    where: { userId: user.id },
    select: { workspaceId: true },
  });

  return membership?.workspaceId || null;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const apiKey = process.env.YANDEX_GPT_API_KEY;
    const folderId = process.env.YANDEX_GPT_FOLDER_ID;
    const model = process.env.YANDEX_GPT_MODEL || "yandexgpt-lite";

    if (!apiKey || !folderId) {
      return NextResponse.json(
        { error: "YandexGPT не настроен на сервере." },
        { status: 500 }
      );
    }

    const workspaceId = await getCurrentWorkspaceId();

    if (!workspaceId) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const ticket = await prisma.ticket.findFirst({
      where: { id, workspaceId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: "Обращение не найдено" },
        { status: 404 }
      );
    }

    const conversation = ticket.messages
      .map((message) => {
        const author = message.senderType === "operator" ? "Оператор" : "Клиент";
        return `${author}: ${message.content}`;
      })
      .join("\n");

    const prompt = `
Обращение: ${ticket.title}
Клиент: ${ticket.customerName || "не указано"}
Email: ${ticket.customerEmail || "не указан"}
Источник: ${ticket.source || "не указан"}
Статус: ${ticket.status}
Приоритет: ${ticket.priority}

Переписка:
${conversation || "Сообщений пока нет."}

Сделай краткую сводку для оператора поддержки.

Формат:
1. Суть обращения — одна короткая фраза.
2. Что уже известно — 1-3 пункта.
3. Что нужно сделать дальше — 1-3 пункта.
4. Рекомендуемый тон ответа — коротко.

Важно:
- Пиши на русском языке.
- Не выдумывай факты.
- Если данных мало, так и напиши.
- Не используй название PulseDesk в тексте для клиента.
`.trim();

    const response = await fetch(
      "https://ai.api.cloud.yandex.net/foundationModels/v1/completion",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Api-Key ${apiKey}`,
        },
        body: JSON.stringify({
          modelUri: `gpt://${folderId}/${model}/latest`,
          completionOptions: {
            stream: false,
            temperature: 0.2,
            maxTokens: 700,
          },
          messages: [
            {
              role: "system",
              text: "Ты ИИ-ассистент оператора поддержки. Кратко анализируй обращение и подсказывай следующий шаг. Не выдумывай детали.",
            },
            {
              role: "user",
              text: prompt,
            },
          ],
        }),
      }
    );

    const data = (await response.json()) as YandexCompletionResponse & {
      error?: unknown;
    };

    if (!response.ok) {
      return NextResponse.json(
        { error: "YandexGPT не смог подготовить сводку.", details: data.error },
        { status: 500 }
      );
    }

    const summary = data.result?.alternatives?.[0]?.message?.text?.trim() || "";

    if (!summary) {
      return NextResponse.json(
        { error: "YandexGPT вернул пустую сводку." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      summary,
    });
  } catch (error) {
    console.error("AI summary error:", error);

    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}