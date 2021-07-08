export interface Grid {
  columns: Array<string[]>;
}

export interface GridWithStatus {
  columns: { word: string; selected: boolean; }[][];
}
