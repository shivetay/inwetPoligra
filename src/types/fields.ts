export interface UniversalUnit {
  id: string;
  sortOrder: number;
  sampleValue: string;
}

export interface MeasureUnit {
  id: string;
  name: string;
  abbreviation: string;
  createdAt: string;
}

export interface CustomColumn {
  id: string;
  name: string;
  unitId: string;
  measureUnitId: string | null;
  sampleValue: string;
  createdAt: string;
}
