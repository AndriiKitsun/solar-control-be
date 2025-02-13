import { NewSystemName, ErrorCode } from '../enums';

export interface HttpError {
  timestamp: string;
  code?: string;
  message?: string;
  errors?: HttpSubError[];
}

export interface HttpSubError {
  type: string;
  message: string;
  reason: string;
  details: HttpErrorDetails[];
}

// new approach
export interface HttpErrorDetails {
  key: string;
  value: string;
}

export interface NewHttpError<T = NewSubError> {
  id: string;
  errors: T[];
  status: number;
  system: NewSystemName;
  timestamp: string;
}

export interface NewSubError {
  message: string;
  type: string;
}

export interface NewHttpSubError extends NewSubError {
  code: ErrorCode | string;
}

export interface NewValidationSubError extends NewSubError {
  details: HttpErrorDetails[];
  property: string;
  reason: string;
}
