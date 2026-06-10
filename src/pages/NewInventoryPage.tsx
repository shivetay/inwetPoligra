import { useCallback, useEffect, useState } from "react";
import {
  deleteInventoryDraft,
  getInventoryDraft,
  saveInventoryDraft,
} from "../api/inventory";
import { Sidebar } from "../components/Sidebar";
import { SidebarInfoPanel } from "../components/SidebarInfoPanel";
import { InventoryStepper } from "../components/InventoryStepper";
import { Step1BasicInfo, type BasicInfoForm } from "../components/new-inventory/Step1BasicInfo";
import { Step2FieldConfig } from "../components/new-inventory/Step2FieldConfig";
import { defaultSelectedFieldIds } from "../data/mockFields";
import { templates } from "../data/mockTemplates";
import { t, type TranslationKey } from "../i18n";

interface NewInventoryPageProps {
  draftId?: string;
  onConfirm: () => void;
  onCancel: () => void;
  onNavSelect: (key: TranslationKey) => void;
}

const emptyForm: BasicInfoForm = {
  name: "",
  startDate: "",
  notes: "",
  templateId: "",
};

export function NewInventoryPage({
  draftId: initialDraftId,
  onConfirm,
  onCancel,
  onNavSelect,
}: NewInventoryPageProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<BasicInfoForm>(emptyForm);
  const [selectedFieldIds, setSelectedFieldIds] = useState(defaultSelectedFieldIds);
  const [draftId, setDraftId] = useState<string | undefined>(initialDraftId);
  const [loading, setLoading] = useState(!!initialDraftId);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!initialDraftId) return;

    getInventoryDraft(initialDraftId)
      .then((draft) => {
        setDraftId(draft.id);
        setForm({
          name: draft.name,
          startDate: draft.startDate,
          notes: draft.notes,
          templateId: draft.templateId,
        });
        setStep(draft.step === 2 ? 2 : 1);
        setSelectedFieldIds(
          draft.selectedFieldIds.length > 0
            ? draft.selectedFieldIds
            : defaultSelectedFieldIds,
        );
      })
      .finally(() => setLoading(false));
  }, [initialDraftId]);

  const hasUnsavedData =
    form.name.trim() !== "" ||
    form.startDate !== "" ||
    form.notes.trim() !== "" ||
    form.templateId !== "" ||
    step === 2;

  const buildDraftPayload = useCallback(
    () => ({
      id: draftId,
      name: form.name,
      startDate: form.startDate,
      notes: form.notes,
      templateId: form.templateId,
      step,
      selectedFieldIds,
    }),
    [draftId, form, step, selectedFieldIds],
  );

  const handleCancel = useCallback(() => {
    if (hasUnsavedData && !window.confirm(t("newInventory.cancel.confirm"))) {
      return;
    }
    onCancel();
  }, [hasUnsavedData, onCancel]);

  const handleNavSelect = useCallback(
    (key: TranslationKey) => {
      if (hasUnsavedData && !window.confirm(t("newInventory.cancel.confirm"))) {
        return;
      }
      onNavSelect(key);
    },
    [hasUnsavedData, onNavSelect],
  );

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const saved = await saveInventoryDraft(buildDraftPayload());
      setDraftId(saved.id);
      onCancel();
    } finally {
      setSaving(false);
    }
  };

  const handleConfirm = async () => {
    if (draftId) {
      await deleteInventoryDraft(draftId);
    }
    onConfirm();
  };

  const handleAddTemplate = () => {
    // TODO: nawigacja do ekranu tworzenia szablonu
  };

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar activeNav="nav.inventories" onNavSelect={handleNavSelect} />
        <main className="main-content main-content--new-inventory">
          <p className="settings-empty">{t("settings.loading")}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar
        activeNav="nav.inventories"
        onNavSelect={handleNavSelect}
        infoPanel={
          step === 2 ? (
            <SidebarInfoPanel columnCount={selectedFieldIds.length} />
          ) : undefined
        }
      />

      <main className="main-content main-content--new-inventory">
        <div className="new-inventory-header">
          <h1 className="new-inventory-title">{t("newInventory.title")}</h1>
          <div className="new-inventory-actions">
            <button type="button" className="btn-text" onClick={handleCancel}>
              {t("newInventory.cancel")}
            </button>
            <button
              type="button"
              className="btn-secondary"
              disabled={saving}
              onClick={() => void handleSaveDraft()}
            >
              {t("newInventory.saveDraft")}
            </button>
          </div>
        </div>

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
            onConfirm={() => void handleConfirm()}
          />
        )}
      </main>
    </div>
  );
}
