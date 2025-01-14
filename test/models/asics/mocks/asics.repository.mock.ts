import {
  AsicsRepository,
  Asic,
  CreateAsicDto,
  UpdateAsicDto,
} from '@models/asics';
import { ClassMock } from '@common/types/test.types';

export class AsicsRepositoryMock implements ClassMock<AsicsRepository> {
  static readonly asicMock: Asic = {
    id: 'id',
    ip: '123',
    address: 'address',
    password: 'pwd',
    hostname: 'name',
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
