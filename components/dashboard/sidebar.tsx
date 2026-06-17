"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, LayoutDashboard, Settings, Sparkles } from "lucide-react";

const items = [
  {
    label: "Обзор",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Обращения",
    href: "/dashboard/tickets",
    icon: Inbox,
    showCounter: true,
  },
  {
    label: "ИИ-ассистент",
    href: "/dashboard/ai",
    icon: Sparkles,
  },
  {
    label: "Настройки",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function DashboardSidebar({
  unreadTicketsCount = 0,
}: {
  unreadTicketsCount?: number;
}) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[260px] shrink-0 border-r border-black/5 bg-white lg:block">
      <div className="flex h-20 items-center px-6">
        <div>
          <div className="font-bold tracking-tight">PulseDesk</div>
          <div className="text-xs text-zinc-500">
            рабочее пространство поддержки
          </div>
        </div>
      </div>

      <nav className="space-y-1 px-3">
        {items.map((item) => {
          const Icon = item.icon;

          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          const counter =
            item.showCounter && unreadTicketsCount > 0
              ? unreadTicketsCount
              : null;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                active
                  ? "flex h-11 items-center gap-3 rounded-2xl bg-black px-4 text-sm font-medium text-white"
                  : "flex h-11 items-center gap-3 rounded-2xl px-4 text-sm font-medium text-black/60 transition hover:bg-black/[0.04] hover:text-black"
              }
            >
              <Icon className="h-4 w-4" />

              <span className="flex-1">{item.label}</span>

              {counter ? (
                <span
                  className={
                    active
                      ? "rounded-full bg-white px-2 py-0.5 text-xs font-bold text-black"
                      : "rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white"
                  }
                >
                  {counter}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}