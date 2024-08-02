import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AsicLoginResponseDto {
  @Expose()
  token: string;
}
