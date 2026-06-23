"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    setLoading(false);

    if (!response.ok) {
      alert(data.error || "Не удалось создать аккаунт");
      return;
    }

    window.location.href = "/login";
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="rounded-[40px] border border-black/[0.04] bg-white p-10 shadow-sm">
          <div className="mb-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-3xl bg-black text-xl font-black text-white shadow-lg">
              P
            </div>

            <h1 className="text-4xl font-black tracking-tight">
              Создать workspace.
            </h1>

            <p className="mt-3 text-zinc-500 leading-relaxed">
              Начните работу с PulseDesk.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-600">
                Email
              </label>

              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 w-full rounded-2xl border border-black/[0.06] bg-white px-5 outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-600">
                Пароль
              </label>

              <input
                type="password"
                required
                placeholder="Минимум 8 символов"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 w-full rounded-2xl border border-black/[0.06] bg-white px-5 outline-none transition focus:border-black"
              />
            </div>

            <button
              disabled={loading}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-black text-sm font-semibold text-white shadow-lg transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Создаем..." : "Создать аккаунт"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-zinc-500">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="font-semibold text-black hover:opacity-70">
              Войти
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}