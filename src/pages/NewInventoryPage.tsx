import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { SidebarInfoPanel } from "../components/SidebarInfoPanel";
import { InventoryStepper } from "../components/InventoryStepper";
import { Step1BasicInfo, type BasicInfoForm } from "../components/new-inventory/Step1BasicInfo";
import { Step2FieldConfig } from "../components/new-inventory/Step2FieldConfig";
import { defaultSelectedFieldIds } from "../data/mockFields";
import { departments, templates } from "../data/mockTemplates";
import { t } from "../i18n";

interface NewInventoryPageProps {
  onConfirm: () => void;
}

const emptyForm: BasicInfoForm = {
  name: "",
  startDate: "",
  department: "",
  notes: "",
  templateId: "",
};

export function NewInventoryPage({ onConfirm }: NewInventoryPageProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<BasicInfoForm>(emptyForm);
  const [selectedFieldIds, setSelectedFieldIds] = useState(defaultSelectedFieldIds);

  const selectedDepartment = departments.find((d) => d.id === form.department);
  const sectorLabel = selectedDepartment ? t(selectedDepartment.labelKey) : "";

  const handleAddTemplate = () => {
    // TODO: nawigacja do ekranu tworzenia szablonu
  };

  return (
    <div className="app-layout">
      <Sidebar
        activeNav="nav.inventories"
        infoPanel={
          step === 2 ? (
            <SidebarInfoPanel
              columnCount={selectedFieldIds.length}
              sectorLabel={sectorLabel}
            />
          ) : undefined
        }
      />

      <main className="main-content main-content--new-inventory">
        <h1 className="new-inventory-title">{t("newInventory.title")}</h1>

        <InventoryStepper currentStep={step} />

        {step === 1 ? (
          <Step1BasicInfo
            form={form}
            availableTemplates={templates}
            onChange={setForm}
            onNext={() => setStep(2)}
            onAddTemplate={handleAddTemplate}
          />
        ) : (
          <Step2FieldConfig
            selectedFieldIds={selectedFieldIds}
            onSelectedFieldIdsChange={setSelectedFieldIds}
            onBack={() => setStep(1)}
            onConfirm={onConfirm}
          />
        )}
      </main>
    </div>
  );
}
