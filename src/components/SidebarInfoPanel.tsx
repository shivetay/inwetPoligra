import { t } from "../i18n";

interface SidebarInfoPanelProps {
  columnCount: number;
  sectorLabel: string;
}

export function SidebarInfoPanel({ columnCount, sectorLabel }: SidebarInfoPanelProps) {
  return (
    <div className="sidebar-info-panel">
      <div className="sidebar-info-panel__icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      </div>
      <div className="sidebar-info-panel__title">
        {t("newInventory.sidebar.verification.title")}
      </div>
      <p className="sidebar-info-panel__message">
        {t("newInventory.sidebar.verification.message", {
          count: columnCount,
          sector: sectorLabel,
        })}
      </p>
    </div>
  );
}
