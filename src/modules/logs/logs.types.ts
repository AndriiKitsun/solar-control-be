import { LogDto } from './dto';

export type LogPayload = Omit<LogDto, 'level'>;
