import { IsUUID } from 'class-validator';

export class IdParams {
  @IsUUID()
  id!: string;
}
