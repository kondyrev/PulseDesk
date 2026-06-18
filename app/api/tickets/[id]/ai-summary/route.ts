import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

type AiStatusSuggestion =
  | "waiting_operator"
  | "waiting_customer"
  | "resolved"
  | "closed";

type AiSummary = {
  summary: string;
  important: string;
  customerIntent: string;
  sentiment: string;
  urgency: string;
  risk: string;
  recommendedAction: string;
  nextStep: string;
  suggestedReply: string;
  statusSuggestion: AiStatusSuggestion;
  statusReason: string;
  checklist: string[];
};

function extractJson(text: string): AiSummary | null {
  try {
    return JSON.parse(text) as AiSummary;
  } catch {
    const match = text.match(/\{[\s\S]*\}/);

    if (!match) return null;

    try {
      return JSON.parse(match[0]) as AiSummary;
    } catch {
      return null;
    }
  }
}

function createFallbackSummary(): AiSummary {
  return {
    summary: "ИИ не смог уверенно подготовить сводку по обращению.",
    important:
      "Проверьте последние сообщения клиента и уточните, что именно требуется решить.",
    customerIntent: "Нужно уточнить по диалогу.",
    sentiment: "нейтральное",
    urgency: "обычная",
    risk: "низкий",
    recommendedAction: "прочитать последние сообщения и ответить клиенту вручную",
    nextStep: "подготовить короткий уточняющий ответ",
    suggestedReply:
      "Спасибо за сообщение. Уточните, пожалуйста, детали, чтобы мы могли быстрее помочь.",
    statusSuggestion: "waiting_operator",
    statusReason: "Требуется ручная проверка оператором.",
    checklist: [
      "Проверить последнее сообщение клиента",
      "Уточнить недостающие данные",
      "Ответить понятным и спокойным тоном",
    ],
  };
}

function normalizeStatusSuggestion(value: string): AiStatusSuggestion {
  if (
    value === "waiting_operator" ||
    value === "waiting_customer" ||
    value === "resolved" ||
    value === "closed"
  ) {
    return value;
  }

  return "waiting_operator";
}

function normalizeSummary(value: Partial<AiSummary> | null): AiSummary {
  const fallback = createFallbackSummary();

  if (!value) return fallback;

  return {
    summary: String(value.summary || fallback.summary).trim(),
    important: String(value.important || fallback.important).trim(),
    customerIntent: String(
      value.customerIntent || fallback.customerIntent
    ).trim(),
    sentiment: String(value.sentiment || fallback.sentiment).trim(),
    urgency: String(value.urgency || fallback.urgency).trim(),
    risk: String(value.risk || fallback.risk).trim(),
    recommendedAction: String(
      value.recommendedAction || fallback.recommendedAction
    ).trim(),
    nextStep: String(value.nextStep || fallback.nextStep).trim(),
    suggestedReply: String(value.suggestedReply || fallback.suggestedReply).trim(),
    statusSuggestion: normalizeStatusSuggestion(
      String(value.statusSuggestion || fallback.statusSuggestion)
    ),
    statusReason: String(value.statusReason || fallback.statusReason).trim(),
    checklist:
      Array.isArray(value.checklist) && value.checklist.length
        ? value.checklist.map((item) => String(item)).slice(0, 5)
        : fallback.checklist,
  };
}

async function getCurrentWorkspaceId() {
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

  return membership?.workspace_id || null;
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
          take: 60,
        },
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: "Обращение не найдено." },
        { status: 404 }
      );
    }

    if (!ticket.messages.length) {
      return NextResponse.json({
        ok: true,
        summary: createFallbackSummary(),
      });
    }

    const conversation = ticket.messages
      .map((message, index) => {
        const author =
          message.senderType === "customer"
            ? "Клиент"
            : message.senderType === "operator"
              ? "Оператор"
              : "Система";

        return `${index + 1}. ${author}: ${message.content}`;
      })
      .join("\n")
      .slice(-12000);

    const systemPrompt = `
Ты — ИИ-помощник оператора службы поддержки PulseDesk.

Твоя задача — не заменять оператора, а помогать ему быстрее понять обращение и подготовить качественный ответ.

Отвечай только валидным JSON без Markdown.

Структура JSON:
{
  "summary": "короткая сводка обращения в 1-2 предложения",
  "important": "самое важное, что оператор не должен упустить",
  "customerIntent": "что клиент хочет получить",
  "sentiment": "настроение клиента: спокойное / раздражённое / тревожное / благодарное / нейтральное",
  "urgency": "срочность: низкая / обычная / высокая / критическая",
  "risk": "риск: низкий / средний / высокий, и почему",
  "recommendedAction": "что оператору лучше сделать сейчас",
  "nextStep": "один конкретный следующий шаг",
  "suggestedReply": "готовый черновик ответа клиенту на русском языке",
  "statusSuggestion": "waiting_operator | waiting_customer | resolved | closed",
  "statusReason": "почему предложен такой статус",
  "checklist": ["короткий пункт", "короткий пункт", "короткий пункт"]
}

Правила:
- Не выдумывай факты.
- Если данных мало, предложи уточняющий ответ.
- Ответ клиенту должен быть вежливым, спокойным и без канцелярита.
- Не обещай того, чего оператор не писал.
- Если клиент явно подтвердил, что всё решено, предложи resolved.
- Если последнее сообщение клиента требует ответа, предложи waiting_operator.
- Если последнее сообщение оператора и он задал вопрос клиенту, предложи waiting_customer.
`.trim();

    const userPrompt = `
Обращение:
Тема: ${ticket.title}
Клиент: ${ticket.customerName || "не указан"}
Email: ${ticket.customerEmail || "не указан"}
Текущий статус: ${ticket.status}
Приоритет: ${ticket.priority}

Диалог:
${conversation}
`.trim();

    const response = await fetch(
      "https://llm.api.cloud.yandex.net/foundationModels/v1/completion",
      {
        method: "POST",
        headers: {
          Authorization: `Api-Key ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          modelUri: `gpt://${folderId}/${model}`,
          completionOptions: {
            stream: false,
            temperature: 0.2,
            maxTokens: 1800,
          },
          messages: [
            {
              role: "system",
              text: systemPrompt,
            },
            {
              role: "user",
              text: userPrompt,
            },
          ],
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("YandexGPT error:", result);

      return NextResponse.json(
        { error: "Не удалось получить ответ от YandexGPT." },
        { status: 500 }
      );
    }

    const text =
      result?.result?.alternatives?.[0]?.message?.text ||
      result?.alternatives?.[0]?.message?.text ||
      "";

    const parsed = extractJson(text);
    const summary = normalizeSummary(parsed);

    return NextResponse.json({
      ok: true,
      summary,
    });
  } catch (error) {
    console.error("AI summary error:", error);

    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}