mod commands;
mod db;

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let conn = db::init(app.handle()).map_err(|e| e.to_string())?;
            app.manage(db::DbState(std::sync::Mutex::new(conn)));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::list_universal_units,
            commands::list_measure_units,
            commands::create_measure_unit,
            commands::delete_measure_unit,
            commands::list_custom_columns,
            commands::create_custom_column,
            commands::delete_custom_column,
            commands::save_inventory_draft,
            commands::get_inventory_draft,
            commands::list_inventory_drafts,
            commands::delete_inventory_draft,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
