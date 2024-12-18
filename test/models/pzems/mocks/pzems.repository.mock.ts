import { PzemsRepository, Pzem, RecentPzemForCalc } from '@models/pzems';
import { EspPzemData } from '@api/modules';
import { ClassMock } from '@common/types/test.types';

export class PzemsRepositoryMock implements ClassMock<PzemsRepository> {
  static pzemMock: Pzem = {
    id: 'id',
    createdAtGmt: new Date(),
    pzems: [],
  };

  static recentPzemsMock: Record<string, RecentPzemForCalc> = {
    acInput: {
      name: 'acInput',
      count: 60,
      sum: 1200,
    },
  };

  async create(pzemData: EspPzemData): Promise<Pzem> {
    return PzemsRepositoryMock.pzemMock;
  }

  async findRecentForCalc(
    date: string,
    minutes: number,
  ): Promise<Record<string, RecentPzemForCalc>> {
    return PzemsRepositoryMock.recentPzemsMock;
  }
}
