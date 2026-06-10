import type { Template } from "../../data/mockTemplates";
import { t } from "../../i18n";

export interface BasicInfoForm {
  name: string;
  startDate: string;
  notes: string;
  templateId: string;
}

interface Step1BasicInfoProps {
  form: BasicInfoForm;
  availableTemplates: Template[];
  onChange: (form: BasicInfoForm) => void;
  onNext: () => void;
  onAddTemplate: () => void;
}

function isFormValid(form: BasicInfoForm): boolean {
  return form.name.trim() !== "" && form.startDate !== "";
}

export function Step1BasicInfo({
  form,
  availableTemplates,
  onChange,
  onNext,
  onAddTemplate,
}: Step1BasicInfoProps) {
  const canProceed = isFormValid(form);

  const update = (patch: Partial<BasicInfoForm>) => {
    onChange({ ...form, ...patch });
  };

  return (
    <div className="step1-layout">
      <div className="step1-form-card">
        <div className="form-field">
          <label className="form-field__label" htmlFor="inventory-name">
            {t("newInventory.form.name")}
          </label>
          <input
            id="inventory-name"
            type="text"
            className="form-field__input"
            placeholder={t("newInventory.form.namePlaceholder")}
            value={form.name}
            onChange={(e) => update({ name: e.target.value })}
          />
        </div>

        <div className="form-field">
          <label className="form-field__label" htmlFor="start-date">
            {t("newInventory.form.startDate")}
          </label>
          <input
            id="start-date"
            type="date"
            className="form-field__input"
            value={form.startDate}
            onChange={(e) => update({ startDate: e.target.value })}
          />
        </div>

        <div className="form-field">
          <label className="form-field__label" htmlFor="notes">
            {t("newInventory.form.notes")}
          </label>
          <textarea
            id="notes"
            className="form-field__input form-field__textarea"
            placeholder={t("newInventory.form.notesPlaceholder")}
            rows={4}
            value={form.notes}
            onChange={(e) => update({ notes: e.target.value })}
          />
        </div>

        <button
          type="button"
          className="btn-primary step1-form-card__next"
          disabled={!canProceed}
          onClick={onNext}
        >
          {t("newInventory.next")}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

      <div className="step1-templates">
        <div className="step1-templates__header">
          <h2 className="step1-templates__title">{t("newInventory.templates.title")}</h2>
          <button type="button" className="btn-secondary btn-secondary--compact" onClick={onAddTemplate}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {t("newInventory.templates.addNew")}
          </button>
        </div>

        {availableTemplates.length === 0 ? (
          <div className="step1-templates__empty">
            <p>{t("newInventory.templates.empty")}</p>
          </div>
        ) : (
          <div className="template-list">
            {availableTemplates.map((template) => {
              const isSelected = form.templateId === template.id;
              return (
                <button
                  key={template.id}
                  type="button"
                  className={`template-card${isSelected ? " template-card--selected" : ""}`}
                  onClick={() => update({ templateId: isSelected ? "" : template.id })}
                >
                  <span className="template-card__icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <line x1="3" y1="9" x2="21" y2="9" />
                      <line x1="9" y1="21" x2="9" y2="9" />
                    </svg>
                  </span>
                  <span className="template-card__content">
                    <span className="template-card__name">{t(template.nameKey)}</span>
                    <span className="template-card__desc">{t(template.descriptionKey)}</span>
                  </span>
                  {isSelected && (
                    <span className="template-card__check">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
