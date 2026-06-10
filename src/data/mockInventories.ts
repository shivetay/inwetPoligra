import type { TranslationKey } from "../i18n";

export type InventoryStatusKey = "inProgress" | "completed";

export interface Inventory {
  id: string;
  createdAt: string;
  status: InventoryStatusKey;
  itemCount: number;
  responsible: string;
}

export const kpiData = {
  active: 12,
  completedThisMonth: 148,
  totalShown: 5,
  totalCount: 245,
  activeItemsSum: 1285,
};

export const statusTranslationKeys: Record<InventoryStatusKey, TranslationKey> = {
  inProgress: "status.inProgress",
  completed: "status.completed",
};

export const inventories: Inventory[] = [
  {
    id: "INV-2023-10-24/A",
    createdAt: "24.10.2023, 08:30",
    status: "inProgress",
    itemCount: 1240,
    responsible: "Jan Kowalski",
  },
  {
    id: "INV-2023-10-23/W",
    createdAt: "23.10.2023, 14:15",
    status: "completed",
    itemCount: 850,
    responsible: "Anna Nowak",
  },
  {
    id: "INV-2023-10-22/C",
    createdAt: "22.10.2023, 09:00",
    status: "completed",
    itemCount: 3120,
    responsible: "Marek Jaskólski",
  },
];
