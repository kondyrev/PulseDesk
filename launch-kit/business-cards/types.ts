export type BusinessCardTemplateDifficulty = "beginner" | "advanced";

export type BusinessCardTemplate = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  recommendedFor: string[];
  tags: string[];
  difficulty: BusinessCardTemplateDifficulty;
  partnerReady: boolean;
  order: number;
};

export type BusinessCardData = {
  displayName?: string;
  qrUrl: string;
  qrImageUrl: string;
};
