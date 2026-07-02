"use client";

import {
  Bolt,
  Brush,
  Car,
  GraduationCap,
  Hammer,
  Scissors,
  ShowerHead,
  Sparkles,
  Wrench,
} from "lucide-react";

type Profession = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const professions: Profession[] = [
  {
    id: "plumber",
    title: "Сантехник",
    description: "Вода, трубы, смесители, протечки",
    icon: ShowerHead,
  },
  {
    id: "electrician",
    title: "Электрик",
    description: "Проводка, свет, розетки, щитки",
    icon: Bolt,
  },
  {
    id: "builder",
    title: "Строитель",
    description: "Ремонт, монтаж, отделочные работы",
    icon: Hammer,
  },
  {
    id: "finisher",
    title: "Отделочник",
    description: "Плитка, стены, полы, потолки",
    icon: Brush,
  },
  {
    id: "mechanic",
    title: "Автомеханик",
    description: "Диагностика, ремонт, обслуживание",
    icon: Car,
  },
  {
    id: "beauty",
    title: "Мастер красоты",
    description: "Маникюр, брови, уход, процедуры",
    icon: Scissors,
  },
  {
    id: "tutor",
    title: "Репетитор",
    description: "Занятия, подготовка, обучение",
    icon: GraduationCap,
  },
  {
    id: "other",
    title: "Другое",
    description: "Если вашей профессии пока нет в списке",
    icon: Wrench,
  },
];

type ProfessionSelectProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function ProfessionSelect({
  value,
  onChange,
}: ProfessionSelectProps) {
  return (
    <div>
      <label className="mb-3 block text-sm font-semibold">
        Чем вы занимаетесь?
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        {professions.map((profession) => {
          const Icon = profession.icon;
          const selected = value === profession.id;

          return (
            <button
              key={profession.id}
              type="button"
              onClick={() => onChange(profession.id)}
              className={[
                "group flex items-start gap-3 rounded-2xl border p-4 text-left transition",
                selected
                  ? "border-emerald-400 bg-emerald-50 shadow-[0_12px_30px_rgba(16,185,129,0.12)]"
                  : "border-zinc-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition",
                  selected
                    ? "bg-emerald-500 text-white"
                    : "bg-zinc-100 text-zinc-600 group-hover:bg-emerald-100 group-hover:text-emerald-700",
                ].join(" ")}
              >
                <Icon className="h-5 w-5" />
              </span>

              <span>
                <span className="block font-black">{profession.title}</span>
                <span className="mt-1 block text-sm leading-5 text-zinc-500">
                  {profession.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 rounded-2xl bg-zinc-50 px-4 py-3 text-sm leading-6 text-zinc-600">
        Профессия поможет ПУЛЬСу подобрать правильные слова, первые материалы и
        подсказки Второго пилота.
      </div>
    </div>
  );
}