import { SystemName, ErrorCode } from '../enums';

export interface ServerError<T = SubError> {
  id: string;
  errors: T[];
  status: number;
  system: SystemName;
  timestamp: string;
}

export interface SubError {
  message: string;
  type: string;
}

export interface HttpSubError extends SubError {
  code: ErrorCode | string;
}

export interface ValidationSubError extends SubError {
  details: ErrorDetails[];
  property: string;
  reason: string;
}

export interface ErrorDetails {
  key: string;
  value: string;
}
