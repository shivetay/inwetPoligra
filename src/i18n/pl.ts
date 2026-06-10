export const translations = {
  "app.name": "WarehouseOS",
  "app.subtitle": "System Zarządzania",

  "nav.inventories": "Inwentaryzacje",
  "nav.templates": "Szablony",
  "nav.assortmentLists": "Listy asortymentu",
  "nav.settings": "Ustawienia",

  "inventoryList.searchPlaceholder": "Szukaj Inwentaryzacji...",
  "inventoryList.title": "Lista inwentaryzacji",
  "inventoryList.description":
    "Przeglądaj i zarządzaj bieżącymi procesami kontroli stanów.",
  "inventoryList.newInventory": "Nowa inwentaryzacja",

  "kpi.active": "Aktywne",
  "kpi.completedMonth": "Zakończone (miesiąc)",
  "kpi.quickFiltering": "Szybkie filtrowanie",

  "filter.all": "Wszystkie",
  "filter.inProgress": "W toku",
  "filter.completed": "Zakończone",

  "table.filters": "Filtry",
  "table.sorting": "Sortowanie",
  "table.shownCount": "Pokazano {shown} z {total} inwentaryzacji",
  "table.col.nameId": "Nazwa / ID",
  "table.col.createdAt": "Data utworzenia",
  "table.col.status": "Status",
  "table.col.itemCount": "Liczba pozycji",
  "table.col.responsible": "Odpowiedzialny",
  "table.col.actions": "Akcje",
  "table.footer.activeItemsSum": "Łączna suma aktywnych pozycji",
  "table.actions.more": "Więcej akcji",
  "table.pagination.prev": "Poprzednia strona",
  "table.pagination.next": "Następna strona",

  "status.inProgress": "W TOKU",
  "status.completed": "ZAKOŃCZONA",
} as const;

export type TranslationKey = keyof typeof translations;
