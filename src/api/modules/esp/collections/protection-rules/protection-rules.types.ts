import { components } from '../../types/esp.schema';

export type EspProtectionRule = components['schemas']['ProtectionRule'];

export type EspProtectionRuleBody = components['schemas']['ProtectionRule'] & {
  enabled: boolean;
};
