import { useState } from "react";
import { kpiData } from "../data/mockInventories";
import { t, type TranslationKey } from "../i18n";

type FilterKey = "all" | "inProgress" | "completed";

const filterItems: { id: FilterKey; key: TranslationKey }[] = [
  { id: "all", key: "filter.all" },
  { id: "inProgress", key: "filter.inProgress" },
  { id: "completed", key: "filter.completed" },
];

export function KpiCards() {
  const [filter, setFilter] = useState<FilterKey>("all");

  return (
    <div className="kpi-grid">
      <div className="kpi-card kpi-card--stat">
        <span className="kpi-card__label">{t("kpi.active")}</span>
        <span className="kpi-card__value">{kpiData.active}</span>
      </div>

      <div className="kpi-card kpi-card--stat">
        <span className="kpi-card__label">{t("kpi.completedMonth")}</span>
        <span className="kpi-card__value">{kpiData.completedThisMonth}</span>
      </div>

      <div className="kpi-card kpi-card--filters">
        <span className="kpi-card__label">{t("kpi.quickFiltering")}</span>
        <div className="kpi-filters">
          {filterItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`kpi-filter-btn${filter === item.id ? " kpi-filter-btn--active" : ""}`}
              onClick={() => setFilter(item.id)}
            >
              {t(item.key)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
