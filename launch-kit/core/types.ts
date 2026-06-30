import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";

export type LaunchMaterialCategory = "print" | "digital" | "offline";

export type LaunchExportFormat = "print" | "pdf" | "png";

export type LaunchTemplateDifficulty = "beginner" | "advanced";

export type LaunchTemplateContext = {
  qrUrl: string;
  qrImageUrl: string;
  title?: string;
  subtitle?: string;
  description?: string;
};

export type LaunchTemplateManifest = {
  id: string;
  materialId: string;

  title: string;
  subtitle: string;
  description: string;

  recommendedFor: string[];
  tags: string[];

  difficulty: LaunchTemplateDifficulty;
  partnerReady: boolean;

  supports: LaunchExportFormat[];

  order: number;
  enabled: boolean;
};

export type LaunchTemplate = {
  manifest: LaunchTemplateManifest;
  Preview: ComponentType;
  Render: ComponentType<LaunchTemplateContext>;
};

export type LaunchMaterialManifest = {
  id: string;
  title: string;
  description: string;

  category: LaunchMaterialCategory;
  icon: LucideIcon;

  order: number;
  enabled: boolean;
};

export type LaunchMaterial = {
  manifest: LaunchMaterialManifest;
  templates: LaunchTemplate[];
};