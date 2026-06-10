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

  "newInventory.title": "Nowa Inwentaryzacja",
  "newInventory.step1.label": "KROK 1: Podstawowe informacje",
  "newInventory.step1.short": "Podstawowe informacje",
  "newInventory.step2.label": "KROK 2: Konfiguracja pól",
  "newInventory.step2.short": "Konfiguracja pól",

  "newInventory.form.name": "Nazwa inwentaryzacji",
  "newInventory.form.namePlaceholder": "Np. Inwentaryzacja Kwartalna Q1 2024",
  "newInventory.form.startDate": "Data rozpoczęcia",
  "newInventory.form.department": "Odpowiedzialny dział",
  "newInventory.form.notes": "Uwagi (opcjonalnie)",
  "newInventory.form.notesPlaceholder": "Dodatkowe instrukcje dla zespołu...",
  "newInventory.form.selectDepartment": "Wybierz dział",

  "newInventory.templates.title": "Wybierz gotowy szablon",
  "newInventory.templates.addNew": "Dodaj nowy szablon",
  "newInventory.templates.empty": "Brak dostępnych szablonów. Utwórz szablon, aby kontynuować.",

  "newInventory.template.standard.name": "Standardowy Arkusz",
  "newInventory.template.standard.desc": "ID, Nazwa, JM, Ilość, Cena",
  "newInventory.template.fixedAssets.name": "Pełna Środki Trwałe",
  "newInventory.template.fixedAssets.desc": "+ Nr Seryjny, Lokalizacja, Stan tech.",
  "newInventory.template.food.name": "Artykuły Spożywcze",
  "newInventory.template.food.desc": "+ Data ważności, Nr partii",

  "newInventory.department.warehouseA": "Magazyn Główny - Sektor A",
  "newInventory.department.warehouseB": "Magazyn Główny - Sektor B",
  "newInventory.department.warehouseC": "Magazyn Pomocniczy - Sektor C",

  "newInventory.next": "Dalej: Konfiguracja pól",
  "newInventory.back": "Wróć do informacji",
  "newInventory.confirm": "Zatwierdź i rozpocznij",

  "newInventory.fields.title": "Wybierz kolumny do wyświetlenia",
  "newInventory.fields.customLabel": "Dodaj własne pole tekstowe lub liczbowe",
  "newInventory.fields.customPlaceholder": "Nazwa nowego pola...",
  "newInventory.fields.type": "Typ",
  "newInventory.fields.typeText": "Tekst",
  "newInventory.fields.typeNumber": "Liczba",
  "newInventory.fields.add": "Dodaj",
  "newInventory.fields.orderTitle": "Kolejność w arkuszu",

  "newInventory.preview.title": "Podgląd na żywo",
  "newInventory.preview.badge": "Testowy widok",
  "newInventory.preview.col.lp": "Lp.",
  "newInventory.preview.col.productName": "Nazwa towaru",
  "newInventory.preview.col.unit": "JM",
  "newInventory.preview.col.quantity": "Ilość",
  "newInventory.preview.col.price": "Cena jednostkowa",
  "newInventory.preview.sampleName": "Przykładowy towar A",
  "newInventory.preview.sampleUnit": "szt.",
  "newInventory.preview.sampleQuantity": "120",
  "newInventory.preview.samplePrice": "24,50 zł",

  "newInventory.field.productName": "Nazwa towaru",
  "newInventory.field.unit": "JM",
  "newInventory.field.quantity": "Ilość stwierdzona",
  "newInventory.field.price": "Cena",
  "newInventory.field.sku": "SKU / Kod",
  "newInventory.field.ean": "Kod EAN",
  "newInventory.field.location": "Lokalizacja",
  "newInventory.field.serialNumber": "Nr seryjny",
  "newInventory.field.expiryDate": "Data ważności",

  "newInventory.sidebar.verification.title": "Weryfikacja szablonu",
  "newInventory.sidebar.verification.message":
    "Wybrano {count} kolumn. Ten układ jest zgodny z polityką raportowania dla {sector}.",
} as const;

export type TranslationKey = keyof typeof translations;
