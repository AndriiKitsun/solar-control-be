import { IsIP, IsString, IsNotEmpty } from 'class-validator';
import { Exclude } from 'class-transformer';

export class CreateAsicDto {
  @IsIP()
  ip!: string;

  @IsNotEmpty()
  @IsString()
  address!: string;

  @Exclude({ toPlainOnly: true })
  @IsNotEmpty()
  @IsString()
  password!: string;
}
