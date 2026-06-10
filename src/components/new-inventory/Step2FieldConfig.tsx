import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import {
  createCustomColumn,
  listCustomColumns,
  listMeasureUnits,
  listUniversalUnits,
} from "../../api/fields";
import { availableFields } from "../../data/mockFields";
import { t, type TranslationKey } from "../../i18n";
import type { CustomColumn, MeasureUnit, UniversalUnit } from "../../types/fields";

interface Step2FieldConfigProps {
  selectedFieldIds: string[];
  onSelectedFieldIdsChange: Dispatch<SetStateAction<string[]>>;
  onBack: () => void;
  onConfirm: () => void;
}

const previewSampleValues: Record<string, TranslationKey> = {
  productName: "newInventory.preview.sampleName",
  unit: "newInventory.preview.sampleUnit",
  quantity: "newInventory.preview.sampleQuantity",
  price: "newInventory.preview.samplePrice",
};

function unitLabelKey(unitId: string): TranslationKey {
  return `unit.${unitId}` as TranslationKey;
}

function customColumnFieldId(columnId: string): string {
  return `custom-col-${columnId}`;
}

function parseCustomColumnId(fieldId: string): string | null {
  if (fieldId.startsWith("custom-col-")) return fieldId.replace("custom-col-", "");
  if (fieldId.startsWith("dept-col-")) return fieldId.replace("dept-col-", "");
  return null;
}

export function Step2FieldConfig({
  selectedFieldIds,
  onSelectedFieldIdsChange,
  onBack,
  onConfirm,
}: Step2FieldConfigProps) {
  const [customFieldName, setCustomFieldName] = useState("");
  const [selectedUnitId, setSelectedUnitId] = useState("text");
  const [selectedMeasureUnitId, setSelectedMeasureUnitId] = useState("");
  const [universalUnits, setUniversalUnits] = useState<UniversalUnit[]>([]);
  const [measureUnits, setMeasureUnits] = useState<MeasureUnit[]>([]);
  const [customColumns, setCustomColumns] = useState<CustomColumn[]>([]);
  const [draggingFieldId, setDraggingFieldId] = useState<string | null>(null);
  const [dragOverFieldId, setDragOverFieldId] = useState<string | null>(null);
  const draggingFieldIdRef = useRef<string | null>(null);

  const loadData = useCallback(async () => {
    const [units, measures, columns] = await Promise.all([
      listUniversalUnits(),
      listMeasureUnits(),
      listCustomColumns(),
    ]);
    setUniversalUnits(units);
    setMeasureUnits(measures);
    setCustomColumns(columns);
    if (units.length > 0) {
      setSelectedUnitId((current) =>
        units.some((u) => u.id === current) ? current : units[0].id,
      );
    }
    if (measures.length > 0) {
      setSelectedMeasureUnitId((current) =>
        measures.some((m) => m.id === current) ? current : measures[0].id,
      );
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    if (!draggingFieldId) return;

    const endDrag = () => {
      draggingFieldIdRef.current = null;
      setDraggingFieldId(null);
      setDragOverFieldId(null);
    };

    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    return () => {
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, [draggingFieldId]);

  const moveField = (fromId: string, toId: string) => {
    onSelectedFieldIdsChange((prev) => {
      const fromIndex = prev.indexOf(fromId);
      const toIndex = prev.indexOf(toId);
      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return prev;

      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const startDrag = (fieldId: string) => (e: React.PointerEvent) => {
    e.preventDefault();
    draggingFieldIdRef.current = fieldId;
    setDraggingFieldId(fieldId);
  };

  const handleDragOverItem = (overId: string) => {
    const fromId = draggingFieldIdRef.current;
    if (!fromId || fromId === overId) return;
    setDragOverFieldId(overId);
    moveField(fromId, overId);
  };

  const toggleField = (fieldId: string) => {
    onSelectedFieldIdsChange((prev) =>
      prev.includes(fieldId) ? prev.filter((id) => id !== fieldId) : [...prev, fieldId],
    );
  };

  const canAddCustomField =
    customFieldName.trim() !== "" &&
    selectedUnitId !== "" &&
    (selectedUnitId !== "measure" || selectedMeasureUnitId !== "");

  const addCustomField = async () => {
    const trimmed = customFieldName.trim();
    if (!trimmed || !selectedUnitId) return;
    if (selectedUnitId === "measure" && !selectedMeasureUnitId) return;

    const created = await createCustomColumn(
      trimmed,
      selectedUnitId,
      selectedUnitId === "measure" ? selectedMeasureUnitId : undefined,
    );
    setCustomColumns((prev) => [...prev, created]);
    onSelectedFieldIdsChange((prev) => [...prev, customColumnFieldId(created.id)]);
    setCustomFieldName("");
  };

  const getPreviewValue = (fieldId: string): string => {
    const builtInSample = previewSampleValues[fieldId];
    if (builtInSample) return t(builtInSample);

    const colId = parseCustomColumnId(fieldId);
    if (colId) {
      const col = customColumns.find((c) => c.id === colId);
      return col?.sampleValue ?? "—";
    }

    return "—";
  };

  const orderedFields = selectedFieldIds
    .map((id) => {
      const builtIn = availableFields.find((f) => f.id === id);
      if (builtIn) {
        return {
          id,
          label: t(builtIn.labelKey),
          previewHeader: builtIn.previewKey ? t(builtIn.previewKey) : t(builtIn.labelKey),
        };
      }

      const colId = parseCustomColumnId(id);
      if (colId) {
        const col = customColumns.find((c) => c.id === colId);
        if (col) {
          return { id, label: col.name, previewHeader: col.name };
        }
      }

      return null;
    })
    .filter(Boolean) as { id: string; label: string; previewHeader: string }[];

  return (
    <div className="step2-layout">
      <div className="step2-main">
        <section className="step2-section">
          <h2 className="step2-section__title">{t("newInventory.fields.title")}</h2>
          <div className="field-chips">
            {availableFields.map((field) => {
              const isSelected = selectedFieldIds.includes(field.id);
              return (
                <button
                  key={field.id}
                  type="button"
                  className={`field-chip${isSelected ? " field-chip--selected" : ""}`}
                  onClick={() => toggleField(field.id)}
                >
                  {isSelected ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  )}
                  {t(field.labelKey)}
                </button>
              );
            })}
          </div>

          {customColumns.length > 0 && (
            <div className="field-chips field-chips--department">
              {customColumns.map((col) => {
                const fieldId = customColumnFieldId(col.id);
                const isSelected = selectedFieldIds.includes(fieldId);
                return (
                  <button
                    key={col.id}
                    type="button"
                    className={`field-chip field-chip--department${isSelected ? " field-chip--selected" : ""}`}
                    onClick={() => toggleField(fieldId)}
                  >
                    {isSelected ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    )}
                    {col.name}
                  </button>
                );
              })}
            </div>
          )}

          <div className="custom-field-form">
            <label className="form-field__label">{t("newInventory.fields.customLabel")}</label>
            <div className="custom-field-form__row">
              <input
                type="text"
                className="form-field__input"
                placeholder={t("newInventory.fields.customPlaceholder")}
                value={customFieldName}
                onChange={(e) => setCustomFieldName(e.target.value)}
              />
              <select
                className="form-field__input form-field__select custom-field-form__type"
                value={selectedUnitId}
                onChange={(e) => setSelectedUnitId(e.target.value)}
              >
                {universalUnits.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {t(unitLabelKey(unit.id))}
                  </option>
                ))}
              </select>
              {selectedUnitId === "measure" && (
                <select
                  className="form-field__input form-field__select custom-field-form__type"
                  value={selectedMeasureUnitId}
                  onChange={(e) => setSelectedMeasureUnitId(e.target.value)}
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
                disabled={!canAddCustomField}
                onClick={() => void addCustomField()}
              >
                {t("newInventory.fields.add")}
              </button>
            </div>
          </div>
        </section>

        <section className="step2-section step2-preview">
          <div className="step2-preview__header">
            <h2 className="step2-section__title">{t("newInventory.preview.title")}</h2>
            <span className="preview-badge">{t("newInventory.preview.badge")}</span>
          </div>
          <div className="preview-table-wrapper">
            <table className="preview-table">
              <thead>
                <tr>
                  <th>{t("newInventory.preview.col.lp")}</th>
                  {orderedFields.map((col) => (
                    <th key={col.id}>{col.previewHeader}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  {orderedFields.map((col) => (
                    <td key={col.id}>{getPreviewValue(col.id)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <aside className="step2-sidebar">
        <h3 className="step2-sidebar__title">{t("newInventory.fields.orderTitle")}</h3>
        <ul className="field-order-list">
          {orderedFields.map((field) => (
            <li
              key={field.id}
              className={`field-order-item${draggingFieldId === field.id ? " field-order-item--dragging" : ""}${dragOverFieldId === field.id ? " field-order-item--drop-target" : ""}`}
              onPointerEnter={() => handleDragOverItem(field.id)}
            >
              <span
                className="field-order-item__drag"
                aria-hidden="true"
                onPointerDown={startDrag(field.id)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="9" cy="6" r="1.5" />
                  <circle cx="15" cy="6" r="1.5" />
                  <circle cx="9" cy="12" r="1.5" />
                  <circle cx="15" cy="12" r="1.5" />
                  <circle cx="9" cy="18" r="1.5" />
                  <circle cx="15" cy="18" r="1.5" />
                </svg>
              </span>
              <span className="field-order-item__label">{field.label}</span>
            </li>
          ))}
        </ul>
      </aside>

      <div className="step2-footer">
        <button type="button" className="btn-text" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          {t("newInventory.back")}
        </button>
        <button
          type="button"
          className="btn-primary"
          disabled={selectedFieldIds.length === 0}
          onClick={onConfirm}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {t("newInventory.confirm")}
        </button>
      </div>
    </div>
  );
}
