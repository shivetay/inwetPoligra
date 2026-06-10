import { t } from "../i18n";

interface InventoryStepperProps {
  currentStep: 1 | 2;
}

export function InventoryStepper({ currentStep }: InventoryStepperProps) {
  return (
    <div className="stepper">
      <div className={`stepper__step${currentStep >= 1 ? " stepper__step--active" : ""}${currentStep > 1 ? " stepper__step--done" : ""}`}>
        <span className="stepper__circle">
          {currentStep > 1 ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            "1"
          )}
        </span>
        <span className="stepper__label">{t("newInventory.step1.label")}</span>
      </div>

      <div className="stepper__line" />

      <div className={`stepper__step${currentStep >= 2 ? " stepper__step--active" : ""}`}>
        <span className="stepper__circle">2</span>
        <span className="stepper__label">{t("newInventory.step2.label")}</span>
      </div>
    </div>
  );
}
