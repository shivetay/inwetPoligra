import { useState } from "react";
import { InventoryListPage } from "./pages/InventoryListPage";
import { NewInventoryPage } from "./pages/NewInventoryPage";
import { SettingsPage } from "./pages/SettingsPage";
import type { TranslationKey } from "./i18n";
import "./styles/inventory-list.css";
import "./styles/new-inventory.css";
import "./styles/settings.css";

type AppView = "list" | "newInventory" | "settings";

function navKeyToView(key: TranslationKey): AppView | null {
  if (key === "nav.inventories") return "list";
  if (key === "nav.settings") return "settings";
  return null;
}

function App() {
  const [view, setView] = useState<AppView>("list");
  const [editingDraftId, setEditingDraftId] = useState<string | undefined>();

  const handleNavSelect = (key: TranslationKey) => {
    const nextView = navKeyToView(key);
    if (nextView) {
      setEditingDraftId(undefined);
      setView(nextView);
    }
  };

  const goToList = () => {
    setEditingDraftId(undefined);
    setView("list");
  };

  if (view === "newInventory") {
    return (
      <NewInventoryPage
        draftId={editingDraftId}
        onConfirm={goToList}
        onCancel={goToList}
        onNavSelect={handleNavSelect}
      />
    );
  }

  if (view === "settings") {
    return <SettingsPage onNavSelect={handleNavSelect} />;
  }

  return (
    <InventoryListPage
      onNewInventory={() => {
        setEditingDraftId(undefined);
        setView("newInventory");
      }}
      onResumeDraft={(draftId) => {
        setEditingDraftId(draftId);
        setView("newInventory");
      }}
      onNavSelect={handleNavSelect}
    />
  );
}

export default App;
