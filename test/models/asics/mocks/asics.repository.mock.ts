import {
  AsicsRepository,
  Asic,
  CreateAsicDto,
  UpdateAsicDto,
} from '@models/asics';
import { ClassMock } from '@common/types/test.types';

export class AsicsRepositoryMock implements ClassMock<AsicsRepository> {
  static asicMock: Asic = {
    id: 'id',
    name: 'name',
    ip: '123',
  };

  static asicsMock: Asic[] = [this.asicMock];

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
