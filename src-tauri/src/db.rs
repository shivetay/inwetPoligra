use rusqlite::{params, Connection, Result as SqlResult};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::{AppHandle, Manager};

pub struct DbState(pub Mutex<Connection>);

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct UniversalUnit {
    pub id: String,
    pub sort_order: i32,
    pub sample_value: String,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct MeasureUnit {
    pub id: String,
    pub name: String,
    pub abbreviation: String,
    pub created_at: String,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CustomColumn {
    pub id: String,
    pub name: String,
    pub unit_id: String,
    pub measure_unit_id: Option<String>,
    pub sample_value: String,
    pub created_at: String,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct InventoryDraft {
    pub id: String,
    pub name: String,
    pub start_date: String,
    pub notes: String,
    pub template_id: String,
    pub step: i32,
    pub selected_field_ids: Vec<String>,
    pub updated_at: String,
    pub created_at: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SaveDraftInput {
    pub id: Option<String>,
    pub name: String,
    pub start_date: String,
    pub notes: String,
    pub template_id: String,
    pub step: i32,
    pub selected_field_ids: Vec<String>,
}

fn db_path(app: &AppHandle) -> std::path::PathBuf {
    app.path()
        .app_data_dir()
        .expect("failed to resolve app data directory")
        .join("warehouse.db")
}

pub fn init(app: &AppHandle) -> SqlResult<Connection> {
    let path = db_path(app);
    if let Some(parent) = path.parent() {
        let _ = std::fs::create_dir_all(parent);
    }

    let conn = Connection::open(path)?;
    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS universal_units (
            id TEXT PRIMARY KEY,
            sort_order INTEGER NOT NULL,
            sample_value TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS measure_units (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            abbreviation TEXT NOT NULL,
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS custom_columns (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            unit_id TEXT NOT NULL,
            measure_unit_id TEXT,
            created_at TEXT NOT NULL,
            FOREIGN KEY (unit_id) REFERENCES universal_units(id),
            FOREIGN KEY (measure_unit_id) REFERENCES measure_units(id)
        );

        CREATE TABLE IF NOT EXISTS inventory_drafts (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            start_date TEXT NOT NULL,
            notes TEXT NOT NULL,
            template_id TEXT NOT NULL,
            step INTEGER NOT NULL,
            selected_field_ids_json TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            created_at TEXT NOT NULL
        );
        ",
    )?;

    seed_universal_units(&conn)?;
    seed_measure_units(&conn)?;
    run_migrations(&conn)?;
    Ok(conn)
}

fn run_migrations(conn: &Connection) -> SqlResult<()> {
    let version: u32 = conn.pragma_query_value(None, "user_version", |row| row.get(0))?;

    if version < 2 {
        migrate_to_v2(conn)?;
        conn.pragma_update(None, "user_version", 2)?;
    }

    Ok(())
}

fn migrate_to_v2(conn: &Connection) -> SqlResult<()> {
    conn.execute_batch("PRAGMA foreign_keys=OFF;")?;

    if table_exists(conn, "inventory_drafts")? && column_exists(conn, "inventory_drafts", "department_id")? {
        conn.execute_batch(
            "
            CREATE TABLE inventory_drafts_new (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                start_date TEXT NOT NULL,
                notes TEXT NOT NULL,
                template_id TEXT NOT NULL,
                step INTEGER NOT NULL,
                selected_field_ids_json TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                created_at TEXT NOT NULL
            );
            INSERT INTO inventory_drafts_new (
                id, name, start_date, notes, template_id, step,
                selected_field_ids_json, updated_at, created_at
            )
            SELECT
                id, name, start_date, notes, template_id, step,
                selected_field_ids_json, updated_at, created_at
            FROM inventory_drafts;
            DROP TABLE inventory_drafts;
            ALTER TABLE inventory_drafts_new RENAME TO inventory_drafts;
            ",
        )?;
    }

    if table_exists(conn, "department_columns")? {
        conn.execute_batch(
            "
            INSERT OR IGNORE INTO custom_columns (id, name, unit_id, measure_unit_id, created_at)
            SELECT
                id,
                name,
                CASE WHEN unit_id = 'measure' THEN 'quantity' ELSE unit_id END,
                NULL,
                created_at
            FROM department_columns;
            DROP TABLE department_columns;
            ",
        )?;
    }

    let _ = conn.execute(
        "UPDATE universal_units SET id = 'quantity', sample_value = '120', sort_order = 4 WHERE id = 'measure' AND sample_value = 'szt.'",
        [],
    );
    let _ = conn.execute(
        "INSERT OR IGNORE INTO universal_units (id, sort_order, sample_value) VALUES ('measure', 5, 'szt.')",
        [],
    );
    let _ = conn.execute("DROP TABLE IF EXISTS responsible_units", []);

    conn.execute_batch("PRAGMA foreign_keys=ON;")?;
    Ok(())
}

fn table_exists(conn: &Connection, name: &str) -> SqlResult<bool> {
    let count: i64 = conn.query_row(
        "SELECT COUNT(*) FROM sqlite_master WHERE type = 'table' AND name = ?1",
        params![name],
        |row| row.get(0),
    )?;
    Ok(count > 0)
}

fn column_exists(conn: &Connection, table: &str, column: &str) -> SqlResult<bool> {
    let mut stmt = conn.prepare(&format!("PRAGMA table_info({table})"))?;
    let rows = stmt.query_map([], |row| row.get::<_, String>(1))?;
    for name in rows.flatten() {
        if name == column {
            return Ok(true);
        }
    }
    Ok(false)
}

fn seed_universal_units(conn: &Connection) -> SqlResult<()> {
    let count: i64 =
        conn.query_row("SELECT COUNT(*) FROM universal_units", [], |row| row.get(0))?;

    if count > 0 {
        return Ok(());
    }

    let units = [
        ("text", 1, "Przykładowy tekst"),
        ("number", 2, "120"),
        ("currency", 3, "24,50 zł"),
        ("quantity", 4, "120"),
        ("measure", 5, "szt."),
        ("date", 6, "10.06.2026"),
        ("percent", 7, "99,8%"),
        ("boolean", 8, "Tak"),
    ];

    for (id, sort_order, sample_value) in units {
        conn.execute(
            "INSERT INTO universal_units (id, sort_order, sample_value) VALUES (?1, ?2, ?3)",
            params![id, sort_order, sample_value],
        )?;
    }

    Ok(())
}

fn seed_measure_units(conn: &Connection) -> SqlResult<()> {
    let count: i64 =
        conn.query_row("SELECT COUNT(*) FROM measure_units", [], |row| row.get(0))?;

    if count > 0 {
        return Ok(());
    }

    let units = [
        ("szt", "Sztuka", "szt."),
        ("kg", "Kilogram", "kg"),
        ("m", "Metr", "m"),
        ("l", "Litr", "l"),
    ];

    let now = chrono_lite_now();
    for (id, name, abbreviation) in units {
        conn.execute(
            "INSERT INTO measure_units (id, name, abbreviation, created_at) VALUES (?1, ?2, ?3, ?4)",
            params![id, name, abbreviation, now],
        )?;
    }

    Ok(())
}

pub fn list_universal_units(conn: &Connection) -> SqlResult<Vec<UniversalUnit>> {
    let mut stmt = conn.prepare(
        "SELECT id, sort_order, sample_value FROM universal_units ORDER BY sort_order ASC",
    )?;

    let rows = stmt.query_map([], |row| {
        Ok(UniversalUnit {
            id: row.get(0)?,
            sort_order: row.get(1)?,
            sample_value: row.get(2)?,
        })
    })?;

    rows.collect()
}

pub fn list_measure_units(conn: &Connection) -> SqlResult<Vec<MeasureUnit>> {
    let mut stmt = conn.prepare(
        "SELECT id, name, abbreviation, created_at FROM measure_units ORDER BY name ASC",
    )?;

    let rows = stmt.query_map([], |row| {
        Ok(MeasureUnit {
            id: row.get(0)?,
            name: row.get(1)?,
            abbreviation: row.get(2)?,
            created_at: row.get(3)?,
        })
    })?;

    rows.collect()
}

pub fn create_measure_unit(conn: &Connection, name: &str, abbreviation: &str) -> SqlResult<MeasureUnit> {
    let id = format!(
        "mu-{}",
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .map(|d| d.as_millis())
            .unwrap_or(0)
    );
    let created_at = chrono_lite_now();

    conn.execute(
        "INSERT INTO measure_units (id, name, abbreviation, created_at) VALUES (?1, ?2, ?3, ?4)",
        params![id, name, abbreviation, created_at],
    )?;

    Ok(MeasureUnit {
        id,
        name: name.to_string(),
        abbreviation: abbreviation.to_string(),
        created_at,
    })
}

pub fn delete_measure_unit(conn: &Connection, id: &str) -> SqlResult<()> {
    conn.execute(
        "UPDATE custom_columns SET measure_unit_id = NULL WHERE measure_unit_id = ?1",
        params![id],
    )?;
    conn.execute("DELETE FROM measure_units WHERE id = ?1", params![id])?;
    Ok(())
}

fn resolve_sample_value(
    conn: &Connection,
    unit_id: &str,
    measure_unit_id: Option<&str>,
) -> SqlResult<String> {
    if unit_id == "measure" {
        if let Some(mu_id) = measure_unit_id {
            return conn.query_row(
                "SELECT abbreviation FROM measure_units WHERE id = ?1",
                params![mu_id],
                |row| row.get(0),
            );
        }
        return conn.query_row(
            "SELECT abbreviation FROM measure_units ORDER BY name ASC LIMIT 1",
            [],
            |row| row.get(0),
        );
    }

    conn.query_row(
        "SELECT sample_value FROM universal_units WHERE id = ?1",
        params![unit_id],
        |row| row.get(0),
    )
}

const CUSTOM_COLUMN_SELECT: &str = "
    SELECT
        cc.id,
        cc.name,
        cc.unit_id,
        cc.measure_unit_id,
        cc.created_at,
        CASE
            WHEN cc.unit_id = 'measure' AND cc.measure_unit_id IS NOT NULL THEN mu.abbreviation
            WHEN cc.unit_id = 'measure' THEN COALESCE(
                (SELECT abbreviation FROM measure_units ORDER BY name ASC LIMIT 1),
                uu.sample_value
            )
            ELSE uu.sample_value
        END AS sample_value
    FROM custom_columns cc
    INNER JOIN universal_units uu ON uu.id = cc.unit_id
    LEFT JOIN measure_units mu ON mu.id = cc.measure_unit_id
";

fn map_custom_column_row(row: &rusqlite::Row<'_>) -> SqlResult<CustomColumn> {
    Ok(CustomColumn {
        id: row.get(0)?,
        name: row.get(1)?,
        unit_id: row.get(2)?,
        measure_unit_id: row.get(3)?,
        created_at: row.get(4)?,
        sample_value: row.get(5)?,
    })
}

pub fn list_custom_columns(conn: &Connection) -> SqlResult<Vec<CustomColumn>> {
    let sql = format!("{CUSTOM_COLUMN_SELECT} ORDER BY cc.created_at DESC");
    let mut stmt = conn.prepare(&sql)?;
    let rows = stmt.query_map([], map_custom_column_row)?;
    rows.collect()
}

pub fn create_custom_column(
    conn: &Connection,
    name: &str,
    unit_id: &str,
    measure_unit_id: Option<&str>,
) -> SqlResult<CustomColumn> {
    let id = format!(
        "col-{}",
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .map(|d| d.as_millis())
            .unwrap_or(0)
    );
    let created_at = chrono_lite_now();

    conn.execute(
        "INSERT INTO custom_columns (id, name, unit_id, measure_unit_id, created_at) VALUES (?1, ?2, ?3, ?4, ?5)",
        params![id, name, unit_id, measure_unit_id, created_at],
    )?;

    let sample_value = resolve_sample_value(conn, unit_id, measure_unit_id)?;

    Ok(CustomColumn {
        id,
        name: name.to_string(),
        unit_id: unit_id.to_string(),
        measure_unit_id: measure_unit_id.map(str::to_string),
        sample_value,
        created_at,
    })
}

pub fn delete_custom_column(conn: &Connection, id: &str) -> SqlResult<()> {
    conn.execute("DELETE FROM custom_columns WHERE id = ?1", params![id])?;
    Ok(())
}

pub fn save_inventory_draft(conn: &Connection, input: SaveDraftInput) -> SqlResult<InventoryDraft> {
    let id = input.id.unwrap_or_else(|| {
        format!(
            "draft-{}",
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .map(|d| d.as_millis())
                .unwrap_or(0)
        )
    });

    let now = chrono_lite_now();
    let created_at: String = conn
        .query_row(
            "SELECT created_at FROM inventory_drafts WHERE id = ?1",
            params![&id],
            |row| row.get(0),
        )
        .unwrap_or_else(|_| now.clone());

    let field_ids_json = serde_json::to_string(&input.selected_field_ids)
        .unwrap_or_else(|_| "[]".to_string());

    conn.execute(
        "
        INSERT INTO inventory_drafts (
            id, name, start_date, notes, template_id,
            step, selected_field_ids_json, updated_at, created_at
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
        ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            start_date = excluded.start_date,
            notes = excluded.notes,
            template_id = excluded.template_id,
            step = excluded.step,
            selected_field_ids_json = excluded.selected_field_ids_json,
            updated_at = excluded.updated_at
        ",
        params![
            id,
            input.name,
            input.start_date,
            input.notes,
            input.template_id,
            input.step,
            field_ids_json,
            now,
            created_at,
        ],
    )?;

    get_inventory_draft(conn, &id)
}

pub fn get_inventory_draft(conn: &Connection, id: &str) -> SqlResult<InventoryDraft> {
    conn.query_row(
        "
        SELECT id, name, start_date, notes, template_id,
               step, selected_field_ids_json, updated_at, created_at
        FROM inventory_drafts WHERE id = ?1
        ",
        params![id],
        map_draft_row,
    )
}

pub fn list_inventory_drafts(conn: &Connection) -> SqlResult<Vec<InventoryDraft>> {
    let mut stmt = conn.prepare(
        "
        SELECT id, name, start_date, notes, template_id,
               step, selected_field_ids_json, updated_at, created_at
        FROM inventory_drafts
        ORDER BY updated_at DESC
        ",
    )?;

    let rows = stmt.query_map([], map_draft_row)?;
    rows.collect()
}

pub fn delete_inventory_draft(conn: &Connection, id: &str) -> SqlResult<()> {
    conn.execute("DELETE FROM inventory_drafts WHERE id = ?1", params![id])?;
    Ok(())
}

fn map_draft_row(row: &rusqlite::Row<'_>) -> SqlResult<InventoryDraft> {
    let field_ids_json: String = row.get(6)?;
    let selected_field_ids: Vec<String> =
        serde_json::from_str(&field_ids_json).unwrap_or_default();

    Ok(InventoryDraft {
        id: row.get(0)?,
        name: row.get(1)?,
        start_date: row.get(2)?,
        notes: row.get(3)?,
        template_id: row.get(4)?,
        step: row.get(5)?,
        selected_field_ids,
        updated_at: row.get(7)?,
        created_at: row.get(8)?,
    })
}

fn chrono_lite_now() -> String {
    use std::time::{SystemTime, UNIX_EPOCH};
    let secs = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or(0);
    format!("{secs}")
}
