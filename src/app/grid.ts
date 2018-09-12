export interface Grid {
  columns: Array<string[]>;
}

export interface GridWithStatus {
  columns: Array<{ word: string; selected: boolean; }[]>;
}
