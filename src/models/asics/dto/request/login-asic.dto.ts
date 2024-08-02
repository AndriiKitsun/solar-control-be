import { IsString } from 'class-validator';

export class LoginAsicDto {
  @IsString()
  password: string;
}
