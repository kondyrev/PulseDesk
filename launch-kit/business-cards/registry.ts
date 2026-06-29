import type { BusinessCardTemplate } from "./types";

const templates: BusinessCardTemplate[] = [
  {
    id: "modern",
    title: "Современный",
    subtitle: "Крупный QR и аккуратная подача",
    description:
      "Хороший универсальный вариант для мастеров, которым важно выглядеть профессионально с первого контакта.",
    recommendedFor: ["сантехник", "электрик", "мастер", "ремонт"],
    tags: ["универсальный", "крупный qr", "старт"],
    difficulty: "beginner",
    partnerReady: false,
    order: 1,
  },
  {
    id: "minimal",
    title: "Минимализм",
    subtitle: "Чисто, спокойно, без лишнего",
    description:
      "Подходит тем, кто хочет оставить простую и понятную визитку без визуального шума.",
    recommendedFor: ["самозанятый", "репетитор", "консультант"],
    tags: ["минимализм", "спокойный", "чистый"],
    difficulty: "beginner",
    partnerReady: false,
    order: 2,
  },
  {
    id: "classic",
    title: "Классика",
    subtitle: "Строго и привычно",
    description:
      "Подходит для тех случаев, когда нужна максимально понятная бумажная визитка.",
    recommendedFor: ["мастер", "услуги", "ремонт"],
    tags: ["классика", "печать", "визитка"],
    difficulty: "beginner",
    partnerReady: false,
    order: 3,
  },
];

export const businessCardTemplates = templates.sort(
  (a, b) => a.order - b.order,
);