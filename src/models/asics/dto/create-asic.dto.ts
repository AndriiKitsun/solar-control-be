import { IsIP, IsString, IsNotEmpty } from 'class-validator';

export class CreateAsicDto {
  @IsIP(4)
  ip!: string;

  @IsNotEmpty()
  @IsString()
  address!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}
