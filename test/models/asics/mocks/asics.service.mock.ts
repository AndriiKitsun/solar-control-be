import {
  UpdateAsicDto,
  AsicsService,
  CreateAsicDto,
  Asic,
} from '@models/asics';
import { AsicsRepositoryMock } from './asics.repository.mock';
import { ClassMock } from '@common/types/test.types';

export class AsicsServiceMock implements ClassMock<AsicsService> {
  async create(createAsicDto: CreateAsicDto): Promise<Asic> {
    return AsicsRepositoryMock.asicMock;
  }

  async findAll(): Promise<Asic[]> {
    return Promise.resolve([]);
  }

  async findOne(id: string): Promise<Asic> {
    return AsicsRepositoryMock.asicMock;
  }

  async remove(id: string): Promise<void> {
    return;
  }

  async start(id: string, token: string): Promise<void> {
    return;
  }

  async stop(id: string, token: string): Promise<void> {
    return;
  }

  async update(id: string, updateAsicDto: UpdateAsicDto): Promise<Asic> {
    return AsicsRepositoryMock.asicMock;
  }
}
