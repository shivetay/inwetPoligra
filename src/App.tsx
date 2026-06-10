import { useState } from "react";
import { InventoryListPage } from "./pages/InventoryListPage";
import { NewInventoryPage } from "./pages/NewInventoryPage";
import "./styles/inventory-list.css";
import "./styles/new-inventory.css";

type AppView = "list" | "newInventory";

function App() {
  const [view, setView] = useState<AppView>("list");

  if (view === "newInventory") {
    return (
      <NewInventoryPage onConfirm={() => setView("list")} />
    );
  }

  return (
    <InventoryListPage onNewInventory={() => setView("newInventory")} />
  );
}

export default App;
