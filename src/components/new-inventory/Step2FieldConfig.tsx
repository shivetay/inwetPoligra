import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { availableFields } from "../../data/mockFields";
import { t, type TranslationKey } from "../../i18n";

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

export function Step2FieldConfig({
  selectedFieldIds,
  onSelectedFieldIdsChange,
  onBack,
  onConfirm,
}: Step2FieldConfigProps) {
  const [customFieldName, setCustomFieldName] = useState("");
  const [customFieldType, setCustomFieldType] = useState<"text" | "number">("text");
  const [customFields, setCustomFields] = useState<{ id: string; label: string }[]>([]);
  const [draggingFieldId, setDraggingFieldId] = useState<string | null>(null);
  const [dragOverFieldId, setDragOverFieldId] = useState<string | null>(null);
  const draggingFieldIdRef = useRef<string | null>(null);

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
    if (selectedFieldIds.includes(fieldId)) {
      onSelectedFieldIdsChange(selectedFieldIds.filter((id) => id !== fieldId));
    } else {
      onSelectedFieldIdsChange([...selectedFieldIds, fieldId]);
    }
  };

  const addCustomField = () => {
    const trimmed = customFieldName.trim();
    if (!trimmed) return;

    const id = `custom-${Date.now()}`;
    setCustomFields([...customFields, { id, label: trimmed }]);
    onSelectedFieldIdsChange([...selectedFieldIds, id]);
    setCustomFieldName("");
  };

  const orderedFields = selectedFieldIds
    .map((id) => {
      const builtIn = availableFields.find((f) => f.id === id);
      if (builtIn) return { id, labelKey: builtIn.labelKey as TranslationKey, previewKey: builtIn.previewKey };
      const custom = customFields.find((f) => f.id === id);
      if (custom) return { id, labelKey: null, customLabel: custom.label, previewKey: undefined };
      return null;
    })
    .filter(Boolean) as {
      id: string;
      labelKey: TranslationKey | null;
      customLabel?: string;
      previewKey?: TranslationKey;
    }[];

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
            {customFields.map((field) => (
              <button
                key={field.id}
                type="button"
                className="field-chip field-chip--selected"
                onClick={() => toggleField(field.id)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {field.label}
              </button>
            ))}
          </div>

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
                value={customFieldType}
                onChange={(e) => setCustomFieldType(e.target.value as "text" | "number")}
              >
                <option value="text">{t("newInventory.fields.typeText")}</option>
                <option value="number">{t("newInventory.fields.typeNumber")}</option>
              </select>
              <button type="button" className="btn-secondary" onClick={addCustomField}>
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
                    <th key={col.id}>
                      {col.previewKey ? t(col.previewKey) : col.customLabel}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  {orderedFields.map((col) => (
                    <td key={col.id}>
                      {previewSampleValues[col.id]
                        ? t(previewSampleValues[col.id])
                        : "—"}
                    </td>
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
              <span className="field-order-item__label">
                {field.labelKey ? t(field.labelKey) : field.customLabel}
              </span>
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
