import { CreateLogDto } from './dto';

export type LogPayload = Omit<CreateLogDto, 'level'>;

export interface RunWithLogOptions {
  before: LogPayload;
  after: LogPayload;
}
