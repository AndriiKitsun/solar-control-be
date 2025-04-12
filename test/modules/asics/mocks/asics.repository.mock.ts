import { AsicsRepository } from '@modules/asics/asics.repository';
import { Asic } from '@modules/asics/entities';
import { CreateAsicDto, UpdateAsicDto } from '@modules/asics/dto';
import { ClassMock } from '@common/types/test.types';
import { FindOptionsWhere } from 'typeorm';

export class AsicsRepositoryMock implements ClassMock<AsicsRepository> {
  static readonly asicMock: Asic = {
    id: 'id',
    ip: '192.168.55.1',
    address: 'address',
    password: 'password',
    hostname: 'hostname',
    t2Active: false,
    t2EndStop: false,
    automated: false,
  };

  static readonly asic2Mock: Asic = {
    id: 'id2',
    ip: '192.168.1.21',
    address: 'address',
    password: 'password',
    hostname: 'hostname',
    t2Active: true,
    t2EndStop: true,
    automated: true,
  };

  static readonly asicsMock: Asic[] = [this.asicMock, this.asic2Mock];

  async create(createAsicDto: CreateAsicDto): Promise<Asic> {
    return AsicsRepositoryMock.asicMock;
  }

  async findAll(): Promise<Asic[]> {
    return AsicsRepositoryMock.asicsMock;
  }

  async findWhere(where: FindOptionsWhere<Asic>): Promise<Asic[]> {
    return AsicsRepositoryMock.asicsMock;
  }

  async findOne(id: string): Promise<Asic> {
    return AsicsRepositoryMock.asicMock;
  }

  async update(id: string, updateAsicDto: UpdateAsicDto): Promise<Asic> {
    return AsicsRepositoryMock.asicMock;
  }

  async delete(id: string): Promise<void> {
    return;
  }
}
