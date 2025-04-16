import {
  T1_ZONE_START_HOUR,
  T1_ZONE_END_HOUR,
} from '../constants/date.constants';

export function isT1Zone(): boolean {
  const hours = new Date().getHours();

  return hours >= T1_ZONE_START_HOUR && hours < T1_ZONE_END_HOUR;
}

export function isT2Zone(): boolean {
  return !isT1Zone();
}
