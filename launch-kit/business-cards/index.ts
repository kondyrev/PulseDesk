import { IdCard } from "lucide-react";

import type { LaunchMaterial } from "../types";

export const businessCardsMaterial: LaunchMaterial = {
  id: "business-cards",
  title: "Визитки",
  description: "Готовые визитки с QR-кодом для печати на обычном принтере.",
  category: "print",
  icon: IdCard,
  order: 1,
  enabled: true,
};

export * from "./types";
export * from "./registry";