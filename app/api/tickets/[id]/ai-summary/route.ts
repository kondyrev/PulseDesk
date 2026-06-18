import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

type OperatorInsight = {
  signal: string;
  hiddenRisk: string;
  bestReply: string;
  shortReply: string;
  warmReply: string;
  formalReply: string;
  questionsToAsk: string[];
  dontDo: string[];
  nextStep: string;
};

function fallbackInsight(): OperatorInsight {
  return {
    signal:
      "Недостаточно данных, чтобы уверенно понять эмоциональный контекст. Лучше ответить спокойно и уточнить детали.",
    hiddenRisk:
      "Главный риск — дать слишком общий ответ и не продвинуть обращение к решению.",
    bestReply:
      "Спасибо за сообщение. Уточните, пожалуйста, детали ситуации, чтобы мы могли быстрее разобраться и помочь.",
    shortReply: "Спасибо! Уточните, пожалуйста, детали, и мы проверим.",
    warmReply:
      "Спасибо, что написали. Давайте разберёмся вместе — уточните, пожалуйста, детали ситуации.",
    formalReply:
      "Спасибо за обращение. Пожалуйста, уточните детали ситуации, чтобы мы могли провести проверку.",
    questionsToAsk: ["Какие детали клиент ещё не сообщил?"],
    dontDo: ["Не закрывать обращение без подтверждения клиента."],
    nextStep: "Задать один уточняющий вопрос и дождаться ответа клиента.",
  };
}

function extractJson(text: string): OperatorInsight | null {
  try {
    return JSON.parse(text) as OperatorInsight;
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;

    try {
      return JSON.parse(match[0]) as OperatorInsight;
    } catch {
      return null;
    }
  }
}

function normalizeInsight(value: Partial<OperatorInsight> | null): OperatorInsight {
  const fallback = fallbackInsight();

  if (!value) return fallback;

  return {
    signal: String(value.signal || fallback.signal).trim(),
    hiddenRisk: String(value.hiddenRisk || fallback.hiddenRisk).trim(),
    bestReply: String(value.bestReply || fallback.bestReply).trim(),
    shortReply: String(value.shortReply || fallback.shortReply).trim(),
    warmReply: String(value.warmReply || fallback.warmReply).trim(),
    formalReply: String(value.formalReply || fallback.formalReply).trim(),
    questionsToAsk:
      Array.isArray(value.questionsToAsk) && value.questionsToAsk.length
        ? value.questionsToAsk.map((item) => String(item)).slice(0, 4)
        : fallback.questionsToAsk,
    dontDo:
      Array.isArray(value.dontDo) && value.dontDo.length
        ? value.dontDo.map((item) => String(item)).slice(0, 4)
        : fallback.dontDo,
    nextStep: String(value.nextStep || fallback.nextStep).trim(),
  };
}

async function getCurrentWorkspaceId() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

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
Ты — опытный наставник оператора поддержки PulseDesk.

Ты НЕ должен пересказывать очевидное.
Твоя задача — помочь оператору выбрать правильную следующую реплику.

Думай как специалист по клиентскому общению:
- что клиент чувствует между строк;
- где может возникнуть раздражение;
- какой ответ снизит напряжение;
- какой вопрос продвинет обращение к решению;
- чего оператору лучше не делать.

Отвечай только валидным JSON без Markdown.

Структура:
{
  "signal": "психологический сигнал разговора: что происходит с клиентом и какой тон нужен оператору",
  "hiddenRisk": "скрытый риск: что может ухудшить ситуацию",
  "bestReply": "лучший ответ клиенту прямо сейчас",
  "shortReply": "очень короткая версия ответа",
  "warmReply": "более мягкая и заботливая версия ответа",
  "formalReply": "более официальная версия ответа",
  "questionsToAsk": ["точный вопрос 1", "точный вопрос 2"],
  "dontDo": ["чего оператору не делать", "чего избегать"],
  "nextStep": "один конкретный следующий шаг оператора"
}

Правила:
- Не пиши очевидности вроде 'ответить клиенту'.
- Не выдумывай факты.
- Если данных мало — помоги задать правильный уточняющий вопрос.
- Ответы должны звучать живо, по-русски, без канцелярита.
- Не делай ИИ главным. Оператор принимает решение.
`.trim();

    const userPrompt = `
Обращение:
Тема: ${ticket.title}
Клиент: ${ticket.customerName || "не указан"}
Email: ${ticket.customerEmail || "не указан"}
Текущий статус: ${ticket.status}
Приоритет: ${ticket.priority}

Диалог:
${conversation || "Сообщений пока нет."}
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
            temperature: 0.35,
            maxTokens: 1800,
          },
          messages: [
            { role: "system", text: systemPrompt },
            { role: "user", text: userPrompt },
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

    const text = result?.result?.alternatives?.[0]?.message?.text || "";
    const insight = normalizeInsight(extractJson(text));

    return NextResponse.json({
      ok: true,
      insight,
    });
  } catch (error) {
    console.error("AI operator insight error:", error);

    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}