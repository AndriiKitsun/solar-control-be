import { HttpError } from '../../types';

export function toError(messageOrResponse: string | HttpError): HttpError {
  if (typeof messageOrResponse === 'string') {
    return {
      timestamp: new Date().toJSON(),
      message: messageOrResponse,
    };
  }

  return messageOrResponse;
}
