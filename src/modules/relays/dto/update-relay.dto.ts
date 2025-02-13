import { IsBoolean } from 'class-validator';

export class UpdateRelayDto {
  @IsBoolean()
  status!: boolean;
}
