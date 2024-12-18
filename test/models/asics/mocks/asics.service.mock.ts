import {
  UpdateAsicDto,
  AsicsService,
  CreateAsicDto,
  Asic,
  LoginAsicDto,
} from '@models/asics';
import { AsicLoginResponse } from '@api/modules';
import { AsicsRepositoryMock } from './asics.repository.mock';
import { ClassMock } from '@common/types/test.types';
import { AsicsApiServiceMock } from '@api/modules/asics/mocks/asics.service.mock';

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

  async login(
    id: string,
    loginAsicDto: LoginAsicDto,
  ): Promise<AsicLoginResponse> {
    return AsicsApiServiceMock.loginResponseMock;
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
