"use client";

import { useState } from "react";
import {
  Bolt,
  Brush,
  Car,
  Check,
  ChevronDown,
  GraduationCap,
  Hammer,
  MoreHorizontal,
  Scissors,
  ShowerHead,
} from "lucide-react";

type Profession = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const professions: Profession[] = [
  { id: "plumber", title: "Сантехник", description: "Вода, трубы, смесители, протечки", icon: ShowerHead },
  { id: "electrician", title: "Электрик", description: "Проводка, свет, розетки, щитки", icon: Bolt },
  { id: "builder", title: "Строитель", description: "Ремонт, монтаж, отделочные работы", icon: Hammer },
  { id: "finisher", title: "Отделочник", description: "Плитка, стены, полы, потолки", icon: Brush },
  { id: "mechanic", title: "Автомеханик", description: "Диагностика, ремонт, обслуживание", icon: Car },
  { id: "beauty", title: "Мастер красоты", description: "Маникюр, брови, уход, процедуры", icon: Scissors },
  { id: "tutor", title: "Репетитор", description: "Занятия, подготовка, обучение", icon: GraduationCap },
  { id: "other", title: "Другая профессия", description: "У меня другой вид деятельности", icon: MoreHorizontal },
];

type Props = {
  value: string;
  customValue: string;
  onChange: (value: string) => void;
  onCustomChange: (value: string) => void;
};

export default function ProfessionSelect({
  value,
  customValue,
  onChange,
  onCustomChange,
}: Props) {
  const [open, setOpen] = useState(false);

  const selected = professions.find((item) => item.id === value);
  const SelectedIcon = selected?.icon;

  return (
    <div className="relative">
      <label className="mb-2 block text-sm font-semibold">
        Чем вы занимаетесь?
      </label>

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={[
          "flex h-14 w-full items-center justify-between rounded-2xl border bg-white px-4 text-left transition",
          open ? "border-emerald-400 shadow-[0_10px_30px_rgba(16,185,129,0.12)]" : "border-zinc-200",
        ].join(" ")}
      >
        <span className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            {SelectedIcon ? <SelectedIcon className="h-5 w-5" /> : <MoreHorizontal className="h-5 w-5" />}
          </span>

          <span className={selected ? "font-bold text-zinc-950" : "font-medium text-zinc-400"}>
            {selected ? selected.title : "Выберите профессию"}
          </span>
        </span>

        <ChevronDown className={["h-5 w-5 transition", open ? "rotate-180" : ""].join(" ")} />
      </button>

      {open && (
        <div className="absolute z-20 mt-3 w-full overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.12)]">
          {professions.map((profession) => {
            const Icon = profession.icon;
            const isSelected = profession.id === value;

            return (
              <button
                key={profession.id}
                type="button"
                onClick={() => {
                  onChange(profession.id);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-zinc-50"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
                  <Icon className="h-5 w-5" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block font-black">{profession.title}</span>
                  <span className="mt-1 block text-sm text-zinc-500">
                    {profession.description}
                  </span>
                </span>

                {isSelected && <Check className="h-5 w-5 text-emerald-500" />}
              </button>
            );
          })}
        </div>
      )}

      {value === "other" && (
        <input
          value={customValue}
          onChange={(event) => onCustomChange(event.target.value)}
          className="mt-3 h-12 w-full rounded-2xl border border-zinc-200 px-4 outline-none transition focus:border-black"
          placeholder="Например: мастер по кондиционерам"
        />
      )}
    </div>
  );
}