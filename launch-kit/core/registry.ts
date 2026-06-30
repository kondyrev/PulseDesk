import type { LaunchMaterial, LaunchTemplate } from "./types";

export function getEnabledMaterials(materials: LaunchMaterial[]) {
  return materials
    .filter((material) => material.manifest.enabled)
    .sort((a, b) => a.manifest.order - b.manifest.order);
}

export function getEnabledTemplates(material: LaunchMaterial) {
  return material.templates
    .filter((template) => template.manifest.enabled)
    .sort((a, b) => a.manifest.order - b.manifest.order);
}

export function findTemplate(
  material: LaunchMaterial,
  templateId: string,
): LaunchTemplate | undefined {
  return material.templates.find(
    (template) => template.manifest.id === templateId,
  );
}