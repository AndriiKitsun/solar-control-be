import { UpdateAsicDto } from '@modules/asics/dto';

export class UpdateAsicDtoMock {
  static readonly updateAsicDtoMock: UpdateAsicDto = {
    ip: '192.168.1.21',
    address: 'address',
    password: 'password',
    automated: true,
  };
}
