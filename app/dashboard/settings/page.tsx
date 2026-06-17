"use client";

import { useEffect, useState } from "react";

type WidgetSettings = {
  publicWidgetKey: string;
  isEnabled: boolean;
  companyName: string | null;
  title: string;
  subtitle: string;
  primaryColor: string;
  position: "bottom_right" | "bottom_left";
};

export default function DashboardSettingsPage() {
  const [settings, setSettings] = useState<WidgetSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadSettings() {
      const response = await fetch("/api/settings/widget");
      const data = await response.json();

      setLoading(false);

      if (!response.ok || !data.ok) {
        setMessage(data.error || "Не удалось загрузить настройки.");
        return;
      }

      setSettings(data.settings);
    }

    loadSettings();
  }, []);

  async function handleSave() {
    if (!settings) return;

    setSaving(true);
    setMessage("");

    const response = await fetch("/api/settings/widget", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    });

    const data = await response.json();

    setSaving(false);

    if (!response.ok || !data.ok) {
      setMessage(data.error || "Не удалось сохранить настройки.");
      return;
    }

    setSettings(data.settings);
    setMessage("Настройки сохранены.");
  }

  if (loading) {
    return (
      <div className="p-10 text-sm text-zinc-500">
        Загружаем настройки виджета...
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-10 text-sm font-medium text-red-600">
        {message || "Настройки не найдены."}
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#f6f7f8] p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Настройки</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Настройте виджет поддержки, который видят клиенты на сайте.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-[32px] border border-black/5 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-bold">Виджет поддержки</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Это небольшое лицо вашей поддержки перед клиентами.
              </p>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="text-sm font-semibold text-zinc-600">
                  Название компании
                </span>
                <input
                  value={settings.companyName || ""}
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      companyName: event.target.value,
                    })
                  }
                  className="mt-2 h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/30"
                  placeholder="Например: Acme Store"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-zinc-600">
                  Заголовок
                </span>
                <input
                  value={settings.title}
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      title: event.target.value,
                    })
                  }
                  className="mt-2 h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/30"
                  placeholder="Поддержка"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-zinc-600">
                  Подзаголовок
                </span>
                <input
                  value={settings.subtitle}
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      subtitle: event.target.value,
                    })
                  }
                  className="mt-2 h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/30"
                  placeholder="Обычно отвечаем в течение нескольких минут"
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-zinc-600">
                    Основной цвет
                  </span>
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(event) =>
                      setSettings({
                        ...settings,
                        primaryColor: event.target.value,
                      })
                    }
                    className="mt-2 h-12 w-full rounded-2xl border border-black/10 bg-white px-2"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-zinc-600">
                    Положение
                  </span>
                  <select
                    value={settings.position}
                    onChange={(event) =>
                      setSettings({
                        ...settings,
                        position: event.target.value as
                          | "bottom_right"
                          | "bottom_left",
                      })
                    }
                    className="mt-2 h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none"
                  >
                    <option value="bottom_right">Справа снизу</option>
                    <option value="bottom_left">Слева снизу</option>
                  </select>
                </label>
              </div>

              <label className="flex items-center justify-between rounded-2xl border border-black/5 bg-zinc-50 px-4 py-4">
                <span>
                  <span className="block text-sm font-semibold text-zinc-700">
                    Виджет включён
                  </span>
                  <span className="mt-1 block text-xs text-zinc-500">
                    Если выключить, публичный виджет перестанет отдавать
                    настройки.
                  </span>
                </span>

                <input
                  type="checkbox"
                  checked={settings.isEnabled}
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      isEnabled: event.target.checked,
                    })
                  }
                  className="h-5 w-5"
                />
              </label>

              {message ? (
                <div className="rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-medium text-zinc-600">
                  {message}
                </div>
              ) : null}

              <button
                onClick={handleSave}
                disabled={saving}
                className="h-12 rounded-2xl bg-black px-5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Сохраняем..." : "Сохранить настройки"}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[32px] border border-black/5 bg-white p-6 shadow-sm">
              <div className="mb-4 text-sm font-semibold text-zinc-400">
                Предпросмотр
              </div>

              <div className="rounded-[28px] border border-black/5 bg-[#f6f7f8] p-5">
                <div className="rounded-[24px] bg-white p-5 shadow-sm">
                  <div className="text-lg font-black">
                    {settings.companyName
                      ? `${settings.title} ${settings.companyName}`
                      : settings.title}
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                    {settings.subtitle}
                  </p>
                </div>

                <div className="mt-5 flex justify-end">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg"
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    💬
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-black/5 bg-white p-6 shadow-sm">
              <div className="mb-3 text-sm font-semibold text-zinc-400">
                Код установки
              </div>

              <pre className="overflow-x-auto rounded-2xl bg-zinc-950 p-4 text-xs leading-relaxed text-white">
                {`<script
  src="https://pulsedesk.ru/widget.js"
  data-key="${settings.publicWidgetKey}"
  async
></script>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}