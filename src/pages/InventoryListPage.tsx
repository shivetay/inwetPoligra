import { Sidebar } from "../components/Sidebar";
import { KpiCards } from "../components/KpiCards";
import { InventoryTable } from "../components/InventoryTable";
import { t } from "../i18n";

export function InventoryListPage() {
  return (
    <div className="app-layout">
      <Sidebar />

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
          <button type="button" className="btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {t("inventoryList.newInventory")}
          </button>
        </div>

        <KpiCards />
        <InventoryTable />
      </main>
    </div>
  );
}
