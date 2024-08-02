import { IsString } from 'class-validator';

export class CreateAsicDto {
  @IsString()
  name: string;

  @IsString()
  ip: string;
}
