import { PzemsService, Pzem } from '@models/pzems';
import { EspPzemData, EspResetPzemCounterResponse } from '@api/modules';
import { PzemsRepositoryMock } from '../../mocks/pzems.repository.mock';
import { ClassMock } from '@common/types/test.types';
import { EspApiServiceMock } from '@api/modules/esp/mocks/esp-service.mock';

export class PzemsServiceMock implements ClassMock<PzemsService> {
  async create(pzemData: EspPzemData): Promise<Pzem> {
    return PzemsRepositoryMock.pzemMock;
  }

  async checkHealth(): Promise<string> {
    return EspApiServiceMock.healthCheckResponseMock;
  }

  async resetEnergyCounter(): Promise<EspResetPzemCounterResponse> {
    return EspApiServiceMock.counterResetResponseMock;
  }

  async calcAvgVoltage(pzemData: EspPzemData, minutes: number): Promise<void> {
    return;
  }
}
