"use client";

import ModernBusinessCardPreview from "./templates/modern/preview";
import MinimalBusinessCardPreview from "./templates/minimal/preview";
import ClassicBusinessCardPreview from "./templates/classic/preview";

type Props = {
  templateId: string;
};

export default function BusinessCardTemplatePreview({ templateId }: Props) {
  if (templateId === "minimal") {
    return <MinimalBusinessCardPreview />;
  }

  if (templateId === "classic") {
    return <ClassicBusinessCardPreview />;
  }

  return <ModernBusinessCardPreview />;
}