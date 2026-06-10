import { inventories, kpiData, statusTranslationKeys } from "../data/mockInventories";
import type { InventoryStatusKey } from "../data/mockInventories";
import { t } from "../i18n";

const tableColumns = [
  "table.col.nameId",
  "table.col.createdAt",
  "table.col.status",
  "table.col.itemCount",
  "table.col.responsible",
  "table.col.actions",
] as const;

export interface InventoryTableRow {
  id: string;
  displayId: string;
  createdAt: string;
  status: InventoryStatusKey;
  itemCount: number;
  responsible: string;
  isDraft?: boolean;
  draftId?: string;
}

interface InventoryTableProps {
  draftRows?: InventoryTableRow[];
  onResumeDraft?: (draftId: string) => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatNumber(value: number): string {
  return value.toLocaleString("pl-PL");
}

function StatusBadge({ status }: { status: InventoryStatusKey }) {
  const isProgress = status === "inProgress";
  const isDraft = status === "draft";
  return (
    <span
      className={`status-badge${
        isDraft
          ? " status-badge--draft"
          : isProgress
            ? " status-badge--progress"
            : " status-badge--done"
      }`}
    >
      {t(statusTranslationKeys[status])}
    </span>
  );
}

export function InventoryTable({ draftRows = [], onResumeDraft }: InventoryTableProps) {
  const staticRows: InventoryTableRow[] = inventories.map((inv) => ({
    id: inv.id,
    displayId: inv.id,
    createdAt: inv.createdAt,
    status: inv.status,
    itemCount: inv.itemCount,
    responsible: inv.responsible,
  }));

  const allRows = [...draftRows, ...staticRows];
  const shown = draftRows.length + kpiData.totalShown;

  return (
    <div className="table-section">
      <div className="table-toolbar">
        <div className="table-toolbar__left">
          <button type="button" className="toolbar-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            {t("table.filters")}
          </button>
          <button type="button" className="toolbar-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="10" y1="18" x2="14" y2="18" />
            </svg>
            {t("table.sorting")}
          </button>
        </div>
        <span className="table-toolbar__count">
          {t("table.shownCount", {
            shown,
            total: kpiData.totalCount + draftRows.length,
          })}
        </span>
      </div>

      <div className="table-wrapper">
        <table className="inventory-table">
          <thead>
            <tr>
              {tableColumns.map((colKey) => (
                <th key={colKey}>{t(colKey)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allRows.map((inv) => (
              <tr
                key={inv.id}
                className={inv.isDraft ? "inventory-table__row--draft" : undefined}
                onClick={
                  inv.isDraft && inv.draftId && onResumeDraft
                    ? () => onResumeDraft(inv.draftId!)
                    : undefined
                }
                style={inv.isDraft ? { cursor: "pointer" } : undefined}
              >
                <td className="inventory-table__id">{inv.displayId}</td>
                <td>{inv.createdAt}</td>
                <td>
                  <StatusBadge status={inv.status} />
                </td>
                <td className="inventory-table__number">{formatNumber(inv.itemCount)}</td>
                <td>
                  <div className="responsible">
                    {!inv.isDraft && (
                      <span className="avatar">{getInitials(inv.responsible)}</span>
                    )}
                    {inv.responsible}
                  </div>
                </td>
                <td>
                  {inv.isDraft ? (
                    <button
                      type="button"
                      className="btn-text"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (inv.draftId && onResumeDraft) onResumeDraft(inv.draftId);
                      }}
                    >
                      {t("inventoryList.resumeDraft")}
                    </button>
                  ) : (
                    <button type="button" className="action-btn" aria-label={t("table.actions.more")}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="5" r="2" />
                        <circle cx="12" cy="12" r="2" />
                        <circle cx="12" cy="19" r="2" />
                      </svg>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="inventory-table__footer-label">
                {t("table.footer.activeItemsSum")}
              </td>
              <td className="inventory-table__footer-value">
                {formatNumber(kpiData.activeItemsSum)}
              </td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="pagination">
        <button type="button" className="pagination__btn" aria-label={t("table.pagination.prev")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button type="button" className="pagination__page pagination__page--active">1</button>
        <button type="button" className="pagination__page">2</button>
        <button type="button" className="pagination__page">3</button>
        <span className="pagination__ellipsis">…</span>
        <button type="button" className="pagination__page">32</button>
        <button type="button" className="pagination__btn" aria-label={t("table.pagination.next")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
