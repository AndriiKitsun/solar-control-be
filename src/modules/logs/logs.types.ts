import { CreateLogDto } from './dto';

export type LogPayload = Omit<CreateLogDto, 'level'>;
