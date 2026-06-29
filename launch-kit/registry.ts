import { businessCardsMaterial } from "./business-cards";

export const launchMaterials = [businessCardsMaterial]
  .filter((material) => material.enabled)
  .sort((a, b) => a.order - b.order);