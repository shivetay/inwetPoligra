import { useCallback, useEffect, useState } from "react";
import { listInventoryDrafts } from "../api/inventory";
import { Sidebar } from "../components/Sidebar";
import { KpiCards } from "../components/KpiCards";
import { InventoryTable } from "../components/InventoryTable";
import { t, type TranslationKey } from "../i18n";
import type { InventoryDraft } from "../types/inventory";

interface InventoryListPageProps {
  onNewInventory: () => void;
  onResumeDraft: (draftId: string) => void;
  onNavSelect: (key: TranslationKey) => void;
}

export function InventoryListPage({
  onNewInventory,
  onResumeDraft,
  onNavSelect,
}: InventoryListPageProps) {
  const [drafts, setDrafts] = useState<InventoryDraft[]>([]);

  const loadDrafts = useCallback(async () => {
    try {
      const list = await listInventoryDrafts();
      setDrafts(list);
    } catch {
      setDrafts([]);
    }
  }, []);

  useEffect(() => {
    void loadDrafts();
  }, [loadDrafts]);

  const draftRows = drafts.map((draft) => {
    const displayName = draft.name.trim() || t("newInventory.draft.unnamed");
    const updatedDate = new Date(Number(draft.updatedAt) * 1000);
    const formattedDate = Number.isNaN(updatedDate.getTime())
      ? "—"
      : updatedDate.toLocaleString("pl-PL", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

    return {
      id: draft.id,
      displayId: `DRAFT / ${displayName}`,
      createdAt: formattedDate,
      status: "draft" as const,
      itemCount: draft.selectedFieldIds.length,
      responsible: "—",
      isDraft: true,
      draftId: draft.id,
    };
  });

  return (
    <div className="app-layout">
      <Sidebar activeNav="nav.inventories" onNavSelect={onNavSelect} />

      <main className="main-content">
        <div className="top-bar">
          <div className="search-bar">
            <svg className="search-bar__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              className="search-bar__input"
              placeholder={t("inventoryList.searchPlaceholder")}
            />
          </div>
        </div>

        <div className="page-header">
          <div>
            <h1 className="page-header__title">{t("inventoryList.title")}</h1>
            <p className="page-header__description">
              {t("inventoryList.description")}
            </p>
          </div>
          <button type="button" className="btn-primary" onClick={onNewInventory}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {t("inventoryList.newInventory")}
          </button>
        </div>

        <KpiCards />
        <InventoryTable draftRows={draftRows} onResumeDraft={onResumeDraft} />
      </main>
    </div>
  );
}
