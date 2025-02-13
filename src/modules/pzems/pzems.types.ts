export interface SensorsAvgVoltageGroup {
  count: number;
  sum: number;
}

export interface SensorsAvgVoltageConfig {
  fetchLimit: number;
  countLimit: Record<string, number>;
}
