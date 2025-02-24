export enum ProtectionRuleId {
  AC_OUTPUT_FREQUENCY = 'acOutputFrequency',
  AC_OUTPUT_VOLTAGE = 'acOutputVoltage',
  AC_OUTPUT_AVG_VOLTAGE = 'acOutputAvgVoltage',
  DC_BATTERY_VOLTAGE = 'dcBatteryVoltage',
}

export const enum ProtectionRulesCacheKey {
  GET_RULES = 'getRules',
  GET_ENABLED_RULES = 'getEnabledRules',
}
