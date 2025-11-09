export type DataPoint = { t: number; v: number };
export type Series = { id: string; label?: string; color?: string; points: DataPoint[] };
export type InitialData = { series: Series[] };
