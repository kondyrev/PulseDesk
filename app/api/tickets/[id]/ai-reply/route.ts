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

export async function POST(
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
Приоритет: ${ticket.priority || "не указан"}

Переписка:
${conversation || "Сообщений пока нет."}

Подготовь короткий, вежливый и полезный ответ оператора клиенту.

Важно:
- Пиши на русском языке.
- Не выдумывай факты.
- Если данных мало, попроси уточнить детали.
- Не подписывай ответ от имени PulseDesk.
- PulseDesk — это внутренняя система поддержки, клиент не должен видеть это название.
- Не используй гендерные формулировки от лица оператора.
- Не используй слова "понял", "поняла", "рад", "рада", если пол оператора неизвестен.
- Предпочитай нейтральные формулировки: "Спасибо за обращение", "Благодарим за уточнение", "Мы изучаем ситуацию", "Уточните, пожалуйста".
- Если нужна подпись, используй нейтральное: "С уважением, служба поддержки".
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
            temperature: 0.3,
            maxTokens: 700,
          },
          messages: [
            {
              role: "system",
              text: "Ты ИИ-ассистент оператора поддержки. Помогай писать спокойные, человеческие и полезные ответы клиентам. Не используй название PulseDesk в ответах клиенту. Не используй гендерные формулировки от лица оператора.",
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
        { error: "YandexGPT не смог подготовить ответ.", details: data.error },
        { status: 500 }
      );
    }

    const suggestion =
      data.result?.alternatives?.[0]?.message?.text?.trim() || "";

    if (!suggestion) {
      return NextResponse.json(
        { error: "YandexGPT вернул пустой ответ." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      suggestion,
    });
  } catch (error) {
    console.error("AI reply error:", error);

    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}