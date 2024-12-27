import { IsString, IsIP } from 'class-validator';

export class CreateAsicDto {
  @IsString()
  name!: string;

  @IsIP()
  ip!: string;
}
