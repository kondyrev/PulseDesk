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

Подготовь короткий ответ мастера клиенту.

Стиль:
- Живой человеческий язык.
- Коротко и по делу.
- Без канцелярита.
- Не начинай каждый ответ с "Здравствуйте" и "Спасибо за обращение".
- Не используй фразы уровня колл-центра: "мы изучаем ситуацию", "благодарим за уточнение", "служба поддержки".
- Не называй PulseDesk.
- Не обещай решить проблему без осмотра.
- Если клиент просит приехать и посмотреть — предложи договориться о времени, районе или адресе.
- Если данных мало — задай 1-2 конкретных уточняющих вопроса.
- Ответ должен звучать так, будто пишет частный мастер, а не оператор банка.

Хороший пример тона:
"Да, можно. Напишите, пожалуйста, район и когда вам удобно принять мастера. На месте посмотрим и скажем, что именно нужно заменить и сколько это будет стоить."
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
              text: "Ты помогаешь частному мастеру или небольшой команде отвечать клиентам. Пиши коротко, живо и по делу. Не используй канцелярит, название PulseDesk и шаблонные фразы службы поддержки.",
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