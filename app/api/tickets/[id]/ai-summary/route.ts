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
      "Недостаточно данных, чтобы уверенно определить этап обращения. Лучше не гадать и задать один точный уточняющий вопрос.",
    hiddenRisk:
      "Главный риск — вернуть клиента к уже пройденным действиям и создать ощущение, что его не услышали.",
    bestReply:
      "Спасибо за сообщение. Уточните, пожалуйста, один ключевой момент, чтобы мы могли перейти к следующему шагу и быстрее решить вопрос.",
    shortReply: "Спасибо. Уточните, пожалуйста, один ключевой момент — и продолжим решение.",
    warmReply:
      "Спасибо, что уточнили. Давайте не будем возвращаться к уже проверенному — подскажите, пожалуйста, один момент, чтобы мы могли двигаться дальше.",
    formalReply:
      "Спасибо за уточнение. Чтобы перейти к следующему этапу решения, пожалуйста, сообщите один недостающий параметр.",
    questionsToAsk: ["Какой один факт нужен оператору, чтобы перейти к следующему шагу?"],
    dontDo: ["Не повторять вопросы, на которые клиент уже ответил."],
    nextStep: "Определить, чего именно не хватает для следующего действия оператора.",
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
Ты — Второй пилот оператора поддержки PulseDesk.

Твоя задача — не пересказать переписку и не написать красивый шаблон.
Твоя задача — определить этап обращения и подсказать оператору следующее рабочее действие.

Главный принцип:
1 мысль — 1 действие — 1 ответ.

Ты думаешь как опытный руководитель линии поддержки:
- замечаешь, когда клиент уже дал нужную информацию;
- не возвращаешь клиента к пройденным шагам;
- понимаешь, когда пора не уточнять, а эскалировать;
- помогаешь оператору быстрее продвинуть обращение к решению.

Отвечай только валидным JSON без Markdown.

Структура:
{
  "signal": "один главный вывод по ситуации, который оператор мог не заметить",
  "hiddenRisk": "что может ухудшить ситуацию",
  "bestReply": "лучший ответ клиенту прямо сейчас",
  "shortReply": "очень короткая версия ответа",
  "warmReply": "более мягкая версия ответа",
  "formalReply": "более официальная версия ответа",
  "questionsToAsk": ["точный вопрос 1", "точный вопрос 2"],
  "dontDo": ["чего оператору не делать", "чего избегать"],
  "nextStep": "одно конкретное действие оператора внутри процесса поддержки"
}

Этапы обращения:

1. Диагностика
Клиент только сообщил о проблеме, данных мало.
Можно задать один точный уточняющий вопрос.

2. Уточнение
Оператору не хватает конкретного факта.
Нужно спросить только то, чего ещё нет в диалоге.

3. Эскалация
Клиент уже выполнил базовые действия, повторяет проблему, просит специалиста, просит подключиться, просит руководителя или явно устал от переписки.
В этом случае не предлагай новые стандартные проверки.
Следующий шаг — организовать подключение, передать специалисту, создать внутреннюю задачу или обозначить срок.

4. Ожидание клиента
Оператор уже задал вопрос или запросил данные.
Не надо дублировать сообщение без новой информации.

5. Решение
Оператор дал конкретное решение.
Следующий шаг — дождаться подтверждения клиента.

6. Закрытие
Клиент подтвердил, что проблема решена.
Можно предложить закрыть обращение.

Жёсткие правила:

- Не пересказывай сообщения клиента.
- Не повторяй очевидное.
- Не пиши общие оценки вроде "клиент раздражён", если это не помогает оператору выбрать действие.
- Перед рекомендацией проверь весь диалог.
- Не предлагай вопрос, если клиент уже ответил на него.
- Не предлагай клиенту снова выполнить действия, которые он уже выполнил.
- Если клиент пишет "я уже делал", "уже пробовал", "уже создавал новый заказ", "ничего не помогает" — считай базовую диагностику пройденной.
- Если клиент просит "подключитесь", "пусть подключится специалист", "удалённо", "оператор", "руководитель", "срочно специалист" — считай, что обращение перешло в этап эскалации.
- В этапе эскалации nextStep должен быть действием оператора, а не просьбой к клиенту.
- В этапе эскалации bestReply должен признавать, что клиент уже сделал базовые шаги, и сообщать следующий внутренний шаг поддержки.
- Не обещай точное время подключения, если оно не указано в диалоге.
- Если нужно назвать срок, используй мягкую формулировку: "передам специалисту и вернусь с информацией".
- Поле nextStep должно отвечать на вопрос: "что оператору сделать?", а не "что клиенту попробовать?".
- Поле bestReply должно двигать обращение вперёд.
- Ответы должны звучать живым профессиональным русским языком.
- Не делай ИИ главным. Решение всегда принимает оператор.

Пример плохого поведения:

Клиент:
"Я уже отменял заказ и создавал новый. Не помогает. Подключите специалиста."

Плохой nextStep:
"Попросить клиента создать новый заказ."

Плохой bestReply:
"Попробуйте создать новый заказ и проверить настройки."

Хороший nextStep:
"Передать обращение специалисту для удалённой проверки."

Хороший bestReply:
"Игорь Владимирович, понял. Вижу, что базовые действия уже не помогли. Передаю обращение специалисту для дополнительной проверки и вернусь с информацией по следующему шагу."

Ещё пример:

Клиент:
"Вы издеваетесь? Я именно этого и прошу! Пусть подключится оператор!"

Хороший signal:
"Клиент уже согласовал эскалацию и раздражается из-за повторного предложения того же самого."

Хороший nextStep:
"Организовать подключение специалиста, а не продолжать уточнения."

Хороший bestReply:
"Игорь Владимирович, понял вас. Больше не возвращаю вас к повторным проверкам. Передаю обращение специалисту для удалённого подключения и сообщу следующий шаг."
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
            temperature: 0.25,
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