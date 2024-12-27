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

export interface HttpErrorDetails {
  key: string;
  value: string;
}
