import { Car, Printer, Send, Users } from "lucide-react";

import type { ActionType, PilotState } from "./types";

export const pilotMessages: Record<ActionType | "start", PilotState> = {
  start: {
    title: "Я уже здесь ✨",
    message:
      "QR-код готов. Давайте спокойно сделаем первые шаги, чтобы клиенты смогли связаться с вами уже сегодня.",
  },
  cards: {
    title: "Хороший первый шаг.",
    message:
      "Визитки отлично подходят для старта. Их можно распечатать даже на обычном принтере.",
  },
  telegram: {
    title: "Идём в мессенджеры.",
    message:
      "Я подготовил короткий текст. Его можно отправить клиентам или закрепить в профиле.",
  },
  car: {
    title: "QR на автомобиле — сильная идея.",
    message:
      "Клиент сможет быстро оставить обращение, даже если увидел вас по дороге или во дворе.",
  },
  clients: {
    title: "Начинаем с тех, кто уже вас знает.",
    message: "Постоянные клиенты часто первыми пробуют новый способ связи.",
  },
};

export const firstSteps = [
  {
    action: "cards" as const,
    number: "1",
    icon: Printer,
    title: "Распечатайте визитки",
    text: "Выберите формат и стиль для печати.",
  },
  {
    action: "telegram" as const,
    number: "2",
    icon: Send,
    title: "Добавьте QR в Telegram",
    text: "Получите готовый текст для отправки.",
  },
  {
    action: "car" as const,
    number: "3",
    icon: Car,
    title: "Разместите QR на автомобиле",
    text: "Подготовьте макет наклейки.",
  },
  {
    action: "clients" as const,
    number: "4",
    icon: Users,
    title: "Отправьте ссылку клиентам",
    text: "Скопируйте короткое сообщение.",
  },
];