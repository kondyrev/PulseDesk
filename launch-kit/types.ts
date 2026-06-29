import type { LucideIcon } from "lucide-react";

export type LaunchMaterialCategory = "print" | "digital" | "offline";

export type LaunchMaterial = {
  id: string;
  title: string;
  description: string;
  category: LaunchMaterialCategory;
  icon: LucideIcon;
  order: number;
  enabled: boolean;
};