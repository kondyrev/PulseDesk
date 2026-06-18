"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ChevronsLeft,
  ChevronsRight,
  Inbox,
  LayoutDashboard,
  Settings,
  Sparkles,
} from "lucide-react";

const SIDEBAR_COLLAPSED_KEY = "pulsedesk-sidebar-collapsed";

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
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedValue = window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY);

    setCollapsed(savedValue === "true");
    setMounted(true);
  }, []);

  function toggleCollapsed() {
    const nextValue = !collapsed;

    setCollapsed(nextValue);
    window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(nextValue));
  }

  return (
    <aside
      className={`relative hidden shrink-0 border-r border-black/5 bg-white transition-all duration-200 lg:block ${
        collapsed ? "w-[76px]" : "w-[260px]"
      }`}
    >
      <button
        type="button"
        onClick={toggleCollapsed}
        className="absolute right-[-18px] top-8 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-black/5 bg-white text-zinc-600 shadow-[0_10px_30px_rgba(0,0,0,0.10)] transition hover:scale-105 hover:text-black"
        aria-label={collapsed ? "Развернуть меню" : "Свернуть меню"}
        title={collapsed ? "Развернуть меню" : "Свернуть меню"}
      >
        {collapsed ? (
          <ChevronsRight className="h-4 w-4" />
        ) : (
          <ChevronsLeft className="h-4 w-4" />
        )}
      </button>

      <div
        className={`flex h-20 items-center ${
          collapsed ? "justify-center px-3" : "px-6"
        }`}
      >
        {collapsed ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-sm font-bold text-white">
            PD
          </div>
        ) : (
          <div>
            <div className="font-bold tracking-tight">PulseDesk</div>
            <div className="text-xs text-zinc-500">
              рабочее пространство поддержки
            </div>
          </div>
        )}
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
              title={collapsed ? item.label : undefined}
              className={
                active
                  ? `flex h-11 items-center rounded-2xl bg-black text-sm font-medium text-white ${
                      collapsed ? "justify-center px-0" : "gap-3 px-4"
                    }`
                  : `flex h-11 items-center rounded-2xl text-sm font-medium text-black/60 transition hover:bg-black/[0.04] hover:text-black ${
                      collapsed ? "justify-center px-0" : "gap-3 px-4"
                    }`
              }
            >
              <div className="relative">
                <Icon className="h-4 w-4" />

                {collapsed && counter ? (
                  <span
                    className={
                      active
                        ? "absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-black"
                        : "absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white"
                    }
                  >
                    {counter}
                  </span>
                ) : null}
              </div>

              {!collapsed ? (
                <>
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
                </>
              ) : null}
            </Link>
          );
        })}
      </nav>

      {!mounted ? null : (
        <div className="px-3 pt-6">
          <div
            className={`rounded-2xl bg-zinc-50 text-xs leading-relaxed text-zinc-500 transition ${
              collapsed ? "px-2 py-3 text-center" : "px-4 py-3"
            }`}
          >
            {collapsed ? "ПУЛЬС" : "ПУЛЬС бережно хранит рабочее пространство."}
          </div>
        </div>
      )}
    </aside>
  );
}