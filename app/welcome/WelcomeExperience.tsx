"use client";

import { useMemo, useState } from "react";

import { pilotMessages } from "./data";
import type { ActionType, PilotState } from "./types";

import FirstSteps from "./components/FirstSteps";
import WelcomeQrCard from "./components/WelcomeQrCard";
import SecondPilotCard from "./components/SecondPilotCard";
import ActionModal from "./components/ActionModal";

type WelcomeExperienceProps = {
  qrUrl: string;
  qrImageUrl: string;
};

export default function WelcomeExperience({
  qrUrl,
  qrImageUrl,
}: WelcomeExperienceProps) {
  const [activeAction, setActiveAction] = useState<ActionType | null>(null);
  const [pilotState, setPilotState] = useState<PilotState>(pilotMessages.start);
  const [copied, setCopied] = useState(false);

  const actionTitle = useMemo(() => {
    if (activeAction === "cards") return "Распечатать визитки";
    if (activeAction === "telegram") return "Добавить QR в Telegram";
    if (activeAction === "car") return "Разместить QR на автомобиле";
    if (activeAction === "clients") return "Отправить ссылку клиентам";
    return "";
  }, [activeAction]);

  async function copyQrUrl() {
    await navigator.clipboard.writeText(qrUrl);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1600);
  }

  async function copyText(text: string) {
    await navigator.clipboard.writeText(text);
  }

  function openAction(action: ActionType) {
    setActiveAction(action);
    setPilotState(pilotMessages[action]);
  }

  return (
    <main className="h-screen overflow-hidden bg-[#f4f5f7] px-4 py-4 text-black">
      <div className="mx-auto grid h-full max-w-7xl gap-5 lg:grid-cols-[1.03fr_0.97fr]">
        <WelcomeQrCard
          qrUrl={qrUrl}
          qrImageUrl={qrImageUrl}
          copied={copied}
          onCopy={copyQrUrl}
        />

        <aside className="flex min-h-0 flex-col rounded-[34px] border border-white/10 bg-[#050607] px-7 py-7 text-white shadow-sm">
          <FirstSteps onAction={openAction} />

          <SecondPilotCard pilotState={pilotState} />
        </aside>
      </div>

      {activeAction && (
        <ActionModal
          activeAction={activeAction}
          actionTitle={actionTitle}
          qrUrl={qrUrl}
          qrImageUrl={qrImageUrl}
          onClose={() => setActiveAction(null)}
          onCopyText={copyText}
        />
      )}
    </main>
  );
}
