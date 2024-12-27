import { IsUUID } from 'class-validator';

export class AsicIdParams {
  @IsUUID()
  id!: string;
}
