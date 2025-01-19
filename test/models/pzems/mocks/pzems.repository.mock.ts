import { PzemsRepository, Pzem } from '@models/pzems';
import { EspPzemData } from '@api/modules';
import { ClassMock } from '@common/types/test.types';

export class PzemsRepositoryMock implements ClassMock<PzemsRepository> {
  static readonly pzemMock: Pzem = {
    id: 'id',
    createdAtGmt: new Date(),
    pzems: [],
  };
  static readonly pzemsMock: Pzem[] = [this.pzemMock];

  async create(pzemData: EspPzemData): Promise<Pzem> {
    return PzemsRepositoryMock.pzemMock;
  }

  async findAllBefore(date: string, seconds: number): Promise<Pzem[]> {
    return PzemsRepositoryMock.pzemsMock;
  }

  async clearPzemTable(): Promise<void> {
    return;
  }
}
