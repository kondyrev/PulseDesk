import { Car, Printer, Send, Users } from "lucide-react";

import type { ActionType, PilotState } from "./types";

export const pilotMessages: Record<ActionType | "start", PilotState> = {
  start: {
    title: "Я уже здесь ✨",
    message:
      "Давайте спокойно сделаем первые шаги, чтобы клиенты смогли написать вам уже сегодня.",
  },
  cards: {
    title: "Хороший первый шаг.",
    message:
      "Даже простая визитка поможет клиенту быстро вернуться к вам.",
  },
  telegram: {
    title: "Пусть клиенты узнают, что вы теперь в ПУЛЬСе.",
    message:
      "Я подготовил короткое сообщение — его можно отправить или закрепить в профиле.",
  },
  car: {
    title: "QR на автомобиле — сильная идея.",
    message:
      "Человек увидит вас по дороге или во дворе и сможет сразу написать.",
  },
  clients: {
    title: "Начните с тех, кто уже вас знает.",
    message: "Им проще всего написать первыми.",
  },
};

export const firstSteps = [
  {
    action: "cards" as const,
    number: "1",
    icon: Printer,
    title: "Сделайте первые визитки",
    text: "Дайте клиенту QR, чтобы он мог написать вам позже.",
  },
  {
    action: "telegram" as const,
    number: "2",
    icon: Send,
    title: "Расскажите о ПУЛЬСе в Telegram",
    text: "Скопируйте готовое сообщение для клиентов.",
  },
  {
    action: "car" as const,
    number: "3",
    icon: Car,
    title: "Покажите QR на автомобиле",
    text: "Чтобы вас могли найти по дороге или во дворе.",
  },
  {
    action: "clients" as const,
    number: "4",
    icon: Users,
    title: "Напишите первым клиентам",
    text: "Отправьте короткое сообщение тем, кто вас уже знает.",
  },
];
