import { PzemsService, Pzem, SensorsAvgVoltageConfig } from '@modules/pzems';
import { ClassMock } from '@common/types/test.types';
import { EspSensorsData, EspPzemCounter } from '@api/modules';
import { PzemsRepositoryMock } from './pzems.repository.mock';
import { EspApiServiceMock } from '@api/modules/esp/mocks/esp-service.mock';

export class PzemsServiceMock implements ClassMock<PzemsService> {
  onModuleInit(): void {}

  async handleEspMessage(
    espSensors: EspSensorsData,
    raw: string,
  ): Promise<string> {
    return '';
  }

  async saveSensors(sensorsData: Pzem): Promise<Pzem> {
    return PzemsRepositoryMock.pzemMock;
  }

  async resetEnergyCounter(): Promise<EspPzemCounter[]> {
    return EspApiServiceMock.counterResetResponseMock;
  }

  async calcAvgVoltage(
    sensorsData: Pzem,
    config: SensorsAvgVoltageConfig,
  ): Promise<void> {
    return;
  }
}
