import { useCallback, useEffect, useState } from "react";
import {
  createCustomColumn,
  createMeasureUnit,
  deleteCustomColumn,
  deleteMeasureUnit,
  listCustomColumns,
  listMeasureUnits,
  listUniversalUnits,
} from "../api/fields";
import { Sidebar } from "../components/Sidebar";
import { t, type TranslationKey } from "../i18n";
import type { CustomColumn, MeasureUnit, UniversalUnit } from "../types/fields";

interface SettingsPageProps {
  onNavSelect: (key: TranslationKey) => void;
}

type SettingsTab = "units" | "columns" | "measureUnits";

const tabs: { id: SettingsTab; labelKey: TranslationKey }[] = [
  { id: "units", labelKey: "settings.tabs.units" },
  { id: "columns", labelKey: "settings.tabs.columns" },
  { id: "measureUnits", labelKey: "settings.tabs.measureUnits" },
];

function unitLabelKey(unitId: string): TranslationKey {
  return `unit.${unitId}` as TranslationKey;
}

export function SettingsPage({ onNavSelect }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("units");
  const [columns, setColumns] = useState<CustomColumn[]>([]);
  const [units, setUnits] = useState<UniversalUnit[]>([]);
  const [measureUnits, setMeasureUnits] = useState<MeasureUnit[]>([]);
  const [loading, setLoading] = useState(true);

  const [columnName, setColumnName] = useState("");
  const [columnUnitId, setColumnUnitId] = useState("text");
  const [columnMeasureUnitId, setColumnMeasureUnitId] = useState("");

  const [measureName, setMeasureName] = useState("");
  const [measureAbbreviation, setMeasureAbbreviation] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [cols, unitList, measureList] = await Promise.all([
        listCustomColumns(),
        listUniversalUnits(),
        listMeasureUnits(),
      ]);
      setColumns(cols);
      setUnits(unitList);
      setMeasureUnits(measureList);
      if (unitList.length > 0) {
        setColumnUnitId((current) =>
          unitList.some((u) => u.id === current) ? current : unitList[0].id,
        );
      }
      if (measureList.length > 0) {
        setColumnMeasureUnitId((current) =>
          measureList.some((m) => m.id === current) ? current : measureList[0].id,
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleDeleteColumn = async (id: string) => {
    await deleteCustomColumn(id);
    setColumns((prev) => prev.filter((col) => col.id !== id));
  };

  const handleAddColumn = async () => {
    const trimmed = columnName.trim();
    if (!trimmed || !columnUnitId) return;
    if (columnUnitId === "measure" && !columnMeasureUnitId) return;

    const created = await createCustomColumn(
      trimmed,
      columnUnitId,
      columnUnitId === "measure" ? columnMeasureUnitId : undefined,
    );
    setColumns((prev) => [created, ...prev]);
    setColumnName("");
  };

  const handleAddMeasureUnit = async () => {
    const trimmedName = measureName.trim();
    const trimmedAbbr = measureAbbreviation.trim();
    if (!trimmedName || !trimmedAbbr) return;

    const created = await createMeasureUnit(trimmedName, trimmedAbbr);
    setMeasureUnits((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
    setMeasureName("");
    setMeasureAbbreviation("");
  };

  const handleDeleteMeasureUnit = async (id: string) => {
    await deleteMeasureUnit(id);
    setMeasureUnits((prev) => prev.filter((unit) => unit.id !== id));
    await loadData();
  };

  const getMeasureUnitLabel = (id: string | null) => {
    if (!id) return "—";
    return measureUnits.find((m) => m.id === id)?.abbreviation ?? id;
  };

  const canAddColumn =
    columnName.trim() !== "" &&
    columnUnitId !== "" &&
    (columnUnitId !== "measure" || columnMeasureUnitId !== "");

  return (
    <div className="app-layout">
      <Sidebar activeNav="nav.settings" onNavSelect={onNavSelect} />

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-header__title">{t("settings.title")}</h1>
            <p className="page-header__description">{t("settings.description")}</p>
          </div>
        </div>

        <div className="settings-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`settings-tabs__btn${activeTab === tab.id ? " settings-tabs__btn--active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </div>

        <section className="settings-section">
          {activeTab === "units" && (
            <>
              <p className="settings-section__description">{t("settings.units.description")}</p>
              <div className="unit-tags">
                {units.map((unit) => (
                  <div key={unit.id} className="unit-tag">
                    <span className="unit-tag__name">{t(unitLabelKey(unit.id))}</span>
                    <span className="unit-tag__sample">{unit.sampleValue}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "columns" && (
            <>
              <p className="settings-section__description">{t("settings.columns.description")}</p>

              <div className="settings-add-form">
                <input
                  type="text"
                  className="form-field__input"
                  placeholder={t("settings.columns.namePlaceholder")}
                  value={columnName}
                  onChange={(e) => setColumnName(e.target.value)}
                />
                <select
                  className="form-field__input form-field__select"
                  value={columnUnitId}
                  onChange={(e) => setColumnUnitId(e.target.value)}
                >
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {t(unitLabelKey(unit.id))}
                    </option>
                  ))}
                </select>
                {columnUnitId === "measure" && (
                  <select
                    className="form-field__input form-field__select"
                    value={columnMeasureUnitId}
                    onChange={(e) => setColumnMeasureUnitId(e.target.value)}
                  >
                    {measureUnits.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name} ({unit.abbreviation})
                      </option>
                    ))}
                  </select>
                )}
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={!canAddColumn}
                  onClick={() => void handleAddColumn()}
                >
                  {t("settings.columns.add")}
                </button>
              </div>

              {loading ? (
                <p className="settings-empty">{t("settings.loading")}</p>
              ) : columns.length === 0 ? (
                <p className="settings-empty">{t("settings.columns.empty")}</p>
              ) : (
                <div className="table-wrapper settings-table">
                  <table className="inventory-table">
                    <thead>
                      <tr>
                        <th>{t("settings.columns.col.name")}</th>
                        <th>{t("settings.columns.col.unit")}</th>
                        <th>{t("settings.columns.col.measureUnit")}</th>
                        <th>{t("settings.columns.col.sample")}</th>
                        <th>{t("table.col.actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {columns.map((col) => (
                        <tr key={col.id}>
                          <td className="inventory-table__id">{col.name}</td>
                          <td>{t(unitLabelKey(col.unitId))}</td>
                          <td>
                            {col.unitId === "measure"
                              ? getMeasureUnitLabel(col.measureUnitId)
                              : "—"}
                          </td>
                          <td>{col.sampleValue}</td>
                          <td>
                            <button
                              type="button"
                              className="btn-text btn-text--danger"
                              onClick={() => void handleDeleteColumn(col.id)}
                            >
                              {t("settings.columns.delete")}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {activeTab === "measureUnits" && (
            <>
              <p className="settings-section__description">
                {t("settings.measureUnits.description")}
              </p>

              <div className="settings-add-form">
                <input
                  type="text"
                  className="form-field__input"
                  placeholder={t("settings.measureUnits.namePlaceholder")}
                  value={measureName}
                  onChange={(e) => setMeasureName(e.target.value)}
                />
                <input
                  type="text"
                  className="form-field__input"
                  placeholder={t("settings.measureUnits.abbrPlaceholder")}
                  value={measureAbbreviation}
                  onChange={(e) => setMeasureAbbreviation(e.target.value)}
                />
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={!measureName.trim() || !measureAbbreviation.trim()}
                  onClick={() => void handleAddMeasureUnit()}
                >
                  {t("settings.measureUnits.add")}
                </button>
              </div>

              {loading ? (
                <p className="settings-empty">{t("settings.loading")}</p>
              ) : measureUnits.length === 0 ? (
                <p className="settings-empty">{t("settings.measureUnits.empty")}</p>
              ) : (
                <ul className="responsible-list">
                  {measureUnits.map((unit) => (
                    <li key={unit.id} className="responsible-list__item">
                      <span>
                        {unit.name} <span className="measure-unit-abbr">({unit.abbreviation})</span>
                      </span>
                      <button
                        type="button"
                        className="btn-text btn-text--danger"
                        onClick={() => void handleDeleteMeasureUnit(unit.id)}
                      >
                        {t("settings.measureUnits.delete")}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
