import { invoke } from "@tauri-apps/api/core";
import type { CustomColumn, MeasureUnit, UniversalUnit } from "../types/fields";

export function listUniversalUnits(): Promise<UniversalUnit[]> {
  return invoke<UniversalUnit[]>("list_universal_units");
}

export function listMeasureUnits(): Promise<MeasureUnit[]> {
  return invoke<MeasureUnit[]>("list_measure_units");
}

export function createMeasureUnit(
  name: string,
  abbreviation: string,
): Promise<MeasureUnit> {
  return invoke<MeasureUnit>("create_measure_unit", { name, abbreviation });
}

export function deleteMeasureUnit(id: string): Promise<void> {
  return invoke<void>("delete_measure_unit", { id });
}

export function listCustomColumns(): Promise<CustomColumn[]> {
  return invoke<CustomColumn[]>("list_custom_columns");
}

export function createCustomColumn(
  name: string,
  unitId: string,
  measureUnitId?: string,
): Promise<CustomColumn> {
  return invoke<CustomColumn>("create_custom_column", {
    name,
    unitId,
    measureUnitId: measureUnitId ?? null,
  });
}

export function deleteCustomColumn(id: string): Promise<void> {
  return invoke<void>("delete_custom_column", { id });
}
