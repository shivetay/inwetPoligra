import { invoke } from "@tauri-apps/api/core";
import type { InventoryDraft, SaveDraftInput } from "../types/inventory";

export function saveInventoryDraft(draft: SaveDraftInput): Promise<InventoryDraft> {
  return invoke<InventoryDraft>("save_inventory_draft", { draft });
}

export function getInventoryDraft(id: string): Promise<InventoryDraft> {
  return invoke<InventoryDraft>("get_inventory_draft", { id });
}

export function listInventoryDrafts(): Promise<InventoryDraft[]> {
  return invoke<InventoryDraft[]>("list_inventory_drafts");
}

export function deleteInventoryDraft(id: string): Promise<void> {
  return invoke<void>("delete_inventory_draft", { id });
}
