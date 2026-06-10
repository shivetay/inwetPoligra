use crate::db::{self, DbState, SaveDraftInput};
use tauri::State;

#[tauri::command]
pub fn list_universal_units(state: State<DbState>) -> Result<Vec<db::UniversalUnit>, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    db::list_universal_units(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn list_measure_units(state: State<DbState>) -> Result<Vec<db::MeasureUnit>, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    db::list_measure_units(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn create_measure_unit(
    state: State<DbState>,
    name: String,
    abbreviation: String,
) -> Result<db::MeasureUnit, String> {
    let trimmed_name = name.trim();
    let trimmed_abbr = abbreviation.trim();
    if trimmed_name.is_empty() {
        return Err("Nazwa jednostki nie może być pusta".to_string());
    }
    if trimmed_abbr.is_empty() {
        return Err("Skrót jednostki nie może być pusty".to_string());
    }

    let conn = state.0.lock().map_err(|e| e.to_string())?;
    db::create_measure_unit(&conn, trimmed_name, trimmed_abbr).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_measure_unit(state: State<DbState>, id: String) -> Result<(), String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    db::delete_measure_unit(&conn, &id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn list_custom_columns(state: State<DbState>) -> Result<Vec<db::CustomColumn>, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    db::list_custom_columns(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn create_custom_column(
    state: State<DbState>,
    name: String,
    unit_id: String,
    measure_unit_id: Option<String>,
) -> Result<db::CustomColumn, String> {
    let trimmed = name.trim();
    if trimmed.is_empty() {
        return Err("Nazwa kolumny nie może być pusta".to_string());
    }
    if unit_id == "measure" && measure_unit_id.as_deref().unwrap_or("").is_empty() {
        return Err("Wybierz jednostkę miary".to_string());
    }

    let conn = state.0.lock().map_err(|e| e.to_string())?;
    db::create_custom_column(
        &conn,
        trimmed,
        &unit_id,
        measure_unit_id.as_deref(),
    )
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_custom_column(state: State<DbState>, id: String) -> Result<(), String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    db::delete_custom_column(&conn, &id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn save_inventory_draft(
    state: State<DbState>,
    draft: SaveDraftInput,
) -> Result<db::InventoryDraft, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    db::save_inventory_draft(&conn, draft).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_inventory_draft(
    state: State<DbState>,
    id: String,
) -> Result<db::InventoryDraft, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    db::get_inventory_draft(&conn, &id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn list_inventory_drafts(state: State<DbState>) -> Result<Vec<db::InventoryDraft>, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    db::list_inventory_drafts(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_inventory_draft(state: State<DbState>, id: String) -> Result<(), String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    db::delete_inventory_draft(&conn, &id).map_err(|e| e.to_string())
}
