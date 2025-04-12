import { CreateAsicDto } from '@modules/asics/dto';

export class CreateAsicDtoMock {
  static readonly createAsicDtoMock: CreateAsicDto = {
    ip: '192.168.1.21',
    address: 'address',
    password: 'password',
  };
}
