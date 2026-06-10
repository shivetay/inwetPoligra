import type { TranslationKey } from "../i18n";

export interface Template {
  id: string;
  nameKey: TranslationKey;
  descriptionKey: TranslationKey;
}

export const templates: Template[] = [
  {
    id: "standard",
    nameKey: "newInventory.template.standard.name",
    descriptionKey: "newInventory.template.standard.desc",
  },
  {
    id: "fixed-assets",
    nameKey: "newInventory.template.fixedAssets.name",
    descriptionKey: "newInventory.template.fixedAssets.desc",
  },
  {
    id: "food",
    nameKey: "newInventory.template.food.name",
    descriptionKey: "newInventory.template.food.desc",
  },
];
