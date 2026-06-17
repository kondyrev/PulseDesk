import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type AiSummary = {
  summary: string;
  sentiment: string;
  recommendedAction: string;
  suggestedReply: string;
};

type YandexCompletionResponse = {
  result?: {
    alternatives?: Array<{
      message?: {
        text?: string;
      };
    }>;
  };
};

function extractJson(text: string): AiSummary | null {
  try {
    return JSON.parse(text) as AiSummary;
  } catch {
    const match = text.match(/\{[\s\S]*\}/);

    if (!match) {
      return null;
    }

    try {
      return JSON.parse(match[0]) as AiSummary;
    } catch {
      return null;
    }
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

    const apiKey = process.env.YANDEX_GPT_API_KEY;
    const folderId = process.env.YANDEX_GPT_FOLDER_ID;
    const model = process.env.YANDEX_GPT_MODEL || "yandexgpt-lite";

    if (!apiKey || !folderId) {
      return NextResponse.json(
        { error: "YandexGPT не настроен на сервере." },
        { status: 500 }
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { data: membership } = await supabase
      .from("workspace_members")
      .select("workspace_id")
      .eq("profile_id", user.id)
      .single();

    if (!membership) {
      return NextResponse.json(
        { error: "Рабочее пространство не найдено" },
        { status: 403 }
      );
    }

    const workspaceId = membership.workspace_id;

    const { data: ticket } = await supabase
      .from("tickets")
      .select("id, title, customer_name, customer_email, status, priority, source")
      .eq("id", id)
      .eq("workspace_id", workspaceId)
      .single();

    if (!ticket) {
      return NextResponse.json(
        { error: "Обращение не найдено" },
        { status: 404 }
      );
    }

    const { data: messages } = await supabase
      .from("ticket_messages")
      .select("sender_type, content, page_url, created_at")
      .eq("ticket_id", ticket.id)
      .order("created_at", { ascending: true });

    const conversation = (messages || [])
      .map((message) => {
        const author =
          message.sender_type === "operator" ? "Оператор" : "Клиент";

        return `${author}: ${message.content}`;
      })
      .join("\n");

    const prompt = `
Проанализируй обращение клиента для оператора поддержки.

Обращение: ${ticket.title}
Клиент: ${ticket.customer_name || "не указано"}
Email: ${ticket.customer_email || "не указан"}
Источник: ${ticket.source || "не указан"}
Приоритет: ${ticket.priority || "не указан"}

Переписка:
${conversation || "Сообщений пока нет."}

Верни строго JSON без markdown и без пояснений:

{
  "summary": "краткая сводка обращения в 1-2 предложениях",
  "sentiment": "настроение клиента одним коротким статусом",
  "recommendedAction": "что оператору лучше сделать дальше",
  "suggestedReply": "короткий рекомендуемый ответ клиенту"
}

Важно:
- Пиши на русском языке.
- Не выдумывай факты.
- Не подписывай ответ от имени PulseDesk.
- PulseDesk — это внутренняя система поддержки, клиент не должен видеть это название.
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
            temperature: 0.2,
            maxTokens: 900,
          },
          messages: [
            {
              role: "system",
              text: "Ты ИИ-ассистент оператора поддержки. Анализируй обращения клиентов и возвращай только валидный JSON.",
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

    const rawText =
      data.result?.alternatives?.[0]?.message?.text?.trim() || "";

    const summary = extractJson(rawText);

    if (!summary) {
      return NextResponse.json(
        { error: "YandexGPT вернул некорректный формат." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      summary,
    });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}