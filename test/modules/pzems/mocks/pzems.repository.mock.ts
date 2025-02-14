import { PzemsRepository, Pzem } from '@modules/pzems';
import { ClassMock } from '@common/types/test.types';

export class PzemsRepositoryMock implements ClassMock<PzemsRepository> {
  static readonly pzemMock: Pzem = {
    id: 'id',
    createdAtGmt: new Date(),
    sensors: [],
  };
  static readonly pzemsMock: Pzem[] = [this.pzemMock];

  async save(sensorsData: Pzem): Promise<Pzem> {
    return PzemsRepositoryMock.pzemMock;
  }

  async findAllBefore(date: string, seconds: number): Promise<Pzem[]> {
    return PzemsRepositoryMock.pzemsMock;
  }

  async clearPzemTable(): Promise<void> {
    return;
  }
}
