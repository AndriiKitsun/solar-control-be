import {
  AsicsRepository,
  Asic,
  CreateAsicDto,
  UpdateAsicDto,
} from '@modules/asics';
import { ClassMock } from '@common/types/test.types';

export class AsicsRepositoryMock implements ClassMock<AsicsRepository> {
  static readonly asicMock: Asic = {
    id: 'id',
    ip: '192.168.55.1',
    address: 'address',
    password: 'password',
    hostname: 'hostname',
    token: 'token',
  };

  static readonly asicsMock: Asic[] = [this.asicMock];

  async create(createAsicDto: CreateAsicDto): Promise<Asic> {
    return AsicsRepositoryMock.asicMock;
  }

  async findAll(): Promise<Asic[]> {
    return AsicsRepositoryMock.asicsMock;
  }

  async findOne(id: string): Promise<Asic> {
    return AsicsRepositoryMock.asicMock;
  }

  async update(id: string, updateAsicDto: UpdateAsicDto): Promise<Asic> {
    return AsicsRepositoryMock.asicMock;
  }

  async remove(id: string): Promise<void> {
    return;
  }
}
