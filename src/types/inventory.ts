export interface InventoryDraft {
  id: string;
  name: string;
  startDate: string;
  notes: string;
  templateId: string;
  step: number;
  selectedFieldIds: string[];
  updatedAt: string;
  createdAt: string;
}

export interface SaveDraftInput {
  id?: string;
  name: string;
  startDate: string;
  notes: string;
  templateId: string;
  step: number;
  selectedFieldIds: string[];
}
