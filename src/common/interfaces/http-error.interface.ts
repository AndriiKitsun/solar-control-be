import { HttpErrorType } from '../enums';

export interface HttpError {
  timestamp: string;
  code?: string;
  message?: string;
  errors?: HttpSubError[];
}

export interface HttpSubError {
  type: HttpErrorType;
  message: string;
  reason: string;
  details: HttpErrorDetails[];
}

// new approach
export interface HttpErrorDetails {
  key: string;
  value: string;
}

export enum NewSystemName {
  SERVER = 'Server',
  ASIC = 'Asic',
  ESP = 'ESP',
  DATABASE = 'Database',
}

export interface NewHttpError<T = NewHttpSubError> {
  id: string;
  errors: T[];
  status: number;
  system: NewSystemName;
  timestamp: string;
}

export interface NewHttpSubError {
  errorCode?: string;
  message: string;
  type: HttpErrorType | string;
}

export interface NewValidationSubError extends NewHttpSubError {
  details: HttpErrorDetails[];
  property: string;
  reason: string;
}
