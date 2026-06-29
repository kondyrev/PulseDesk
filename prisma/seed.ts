import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedPartnerCategories() {
  const categories = [
    {
      code: "business_start",
      name: "Старт бизнеса",
      description: "Сервисы, которые помогают мастеру начать своё дело.",
    },
    {
      code: "banking",
      name: "Банки",
      description: "Расчётные счета, карты, финансовые продукты для бизнеса.",
    },
    {
      code: "acquiring",
      name: "Эквайринг",
      description: "Приём оплаты картами, по QR и онлайн.",
    },
    {
      code: "accounting",
      name: "Бухгалтерия",
      description: "Налоги, отчётность, учёт доходов и расходов.",
    },
    {
      code: "edo",
      name: "ЭДО",
      description: "Электронный документооборот.",
    },
    {
      code: "signature",
      name: "Электронная подпись",
      description: "Выпуск и использование электронной подписи.",
    },
    {
      code: "marketing",
      name: "Маркетинг",
      description: "Продвижение, реклама и привлечение клиентов.",
    },
    {
      code: "website",
      name: "Сайт",
      description: "Создание сайта или страницы мастера.",
    },
    {
      code: "delivery",
      name: "Доставка",
      description: "Курьерские и логистические сервисы.",
    },
    {
      code: "insurance",
      name: "Страхование",
      description: "Страховые продукты для мастеров и малого бизнеса.",
    },
  ];

  for (const category of categories) {
    await prisma.partnerCategory.upsert({
      where: { code: category.code },
      update: category,
      create: category,
    });
  }
}

async function seedPartnerPlacements() {
  const placements = [
    {
      code: "registration",
      name: "После регистрации",
      description: "Рекомендации сразу после создания аккаунта.",
    },
    {
      code: "qr_ready",
      name: "QR-код готов",
      description: "Рекомендации на экране готового QR-кода.",
    },
    {
      code: "dashboard",
      name: "Мой ПУЛЬС",
      description: "Рекомендации в рабочем пространстве.",
    },
    {
      code: "second_pilot",
      name: "Второй пилот",
      description: "Рекомендации на основе подсказок ИИ.",
    },
    {
      code: "ticket_sidebar",
      name: "Карточка обращения",
      description: "Рекомендации рядом с обращением.",
    },
    {
      code: "settings",
      name: "Настройки",
      description: "Рекомендации в настройках рабочего пространства.",
    },
    {
      code: "billing",
      name: "Оплата и тарифы",
      description: "Рекомендации на странице тарифов и оплаты.",
    },
  ];

  for (const placement of placements) {
    await prisma.partnerPlacement.upsert({
      where: { code: placement.code },
      update: placement,
      create: placement,
    });
  }
}

async function seedIntents() {
  const categoryByCode = await prisma.partnerCategory.findMany({
    select: { id: true, code: true },
  });

  const categoryMap = new Map(
    categoryByCode.map((category) => [category.code, category.id]),
  );

  const intents = [
    {
      code: "business_start",
      name: "Старт бизнеса",
      description:
        "Пользователь начинает принимать обращения и искать первых клиентов.",
      categoryCode: "business_start",
    },
    {
      code: "bank_account",
      name: "Расчётный счёт",
      description:
        "Пользователю может понадобиться счёт или банковский продукт.",
      categoryCode: "banking",
    },
    {
      code: "acquiring",
      name: "Приём оплаты",
      description: "Пользователь интересуется оплатой картой, QR или онлайн.",
      categoryCode: "acquiring",
    },
    {
      code: "accounting",
      name: "Бухгалтерия и налоги",
      description:
        "Пользователь интересуется налогами, отчётностью или учётом.",
      categoryCode: "accounting",
    },
    {
      code: "edo",
      name: "ЭДО",
      description:
        "Пользователю может понадобиться электронный документооборот.",
      categoryCode: "edo",
    },
    {
      code: "signature",
      name: "Электронная подпись",
      description: "Пользователю может понадобиться электронная подпись.",
      categoryCode: "signature",
    },
    {
      code: "website",
      name: "Сайт",
      description: "Пользователь интересуется сайтом или публичной страницей.",
      categoryCode: "website",
    },
    {
      code: "marketing",
      name: "Продвижение",
      description: "Пользователь хочет получать больше клиентов.",
      categoryCode: "marketing",
    },
    {
      code: "delivery",
      name: "Доставка",
      description:
        "Пользователю может понадобиться доставка товаров или документов.",
      categoryCode: "delivery",
    },
    {
      code: "insurance",
      name: "Страхование",
      description: "Пользователю может понадобиться страхование деятельности.",
      categoryCode: "insurance",
    },
  ];

  for (const intent of intents) {
    const { categoryCode, ...data } = intent;
    const categoryId = categoryMap.get(categoryCode);

    await prisma.intent.upsert({
      where: { code: intent.code },
      update: {
        ...data,
        categoryId,
      },
      create: {
        ...data,
        categoryId,
      },
    });
  }
}

async function main() {
  await seedPartnerCategories();
  await seedPartnerPlacements();
  await seedIntents();

  console.log("Pulse Connect seed completed.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });