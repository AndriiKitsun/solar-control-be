export interface PzemGroup {
  count: number;
  sum: number;
  debug: {
    date: Date;
    voltage?: number;
  }[];
}
