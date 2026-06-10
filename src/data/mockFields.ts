import type { TranslationKey } from "../i18n";

export interface InventoryField {
  id: string;
  labelKey: TranslationKey;
  previewKey?: TranslationKey;
  defaultSelected?: boolean;
}

export const availableFields: InventoryField[] = [
  { id: "productName", labelKey: "newInventory.field.productName", previewKey: "newInventory.preview.col.productName", defaultSelected: true },
  { id: "unit", labelKey: "newInventory.field.unit", previewKey: "newInventory.preview.col.unit", defaultSelected: true },
  { id: "quantity", labelKey: "newInventory.field.quantity", previewKey: "newInventory.preview.col.quantity", defaultSelected: true },
  { id: "price", labelKey: "newInventory.field.price", previewKey: "newInventory.preview.col.price", defaultSelected: true },
  { id: "sku", labelKey: "newInventory.field.sku" },
  { id: "ean", labelKey: "newInventory.field.ean" },
  { id: "location", labelKey: "newInventory.field.location" },
  { id: "serialNumber", labelKey: "newInventory.field.serialNumber" },
  { id: "expiryDate", labelKey: "newInventory.field.expiryDate" },
];

export const defaultSelectedFieldIds = availableFields
  .filter((f) => f.defaultSelected)
  .map((f) => f.id);
