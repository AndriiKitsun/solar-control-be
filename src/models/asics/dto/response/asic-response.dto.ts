import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AsicResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  ip: string;
}
