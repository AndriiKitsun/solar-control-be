import { PzemsService, Pzem, SensorsAvgVoltageConfig } from '@models/pzems';
import { EspSensorsData, EspPzemCounter, EspRelayStatus } from '@api/modules';
import { PzemsRepositoryMock } from '../../mocks/pzems.repository.mock';
import { ClassMock } from '@common/types/test.types';
import { EspApiServiceMock } from '@api/modules/esp/mocks/esp-service.mock';

export class PzemsServiceMock implements ClassMock<PzemsService> {
  async onModuleInit(): Promise<void> {
    return;
  }

  async create(pzemData: EspSensorsData): Promise<Pzem> {
    return PzemsRepositoryMock.pzemMock;
  }

  async resetEnergyCounter(): Promise<EspPzemCounter[]> {
    return EspApiServiceMock.counterResetResponseMock;
  }

  async getPowerStatus(): Promise<EspRelayStatus> {
    return EspApiServiceMock.relayStatus;
  }

  async switchPower(status: boolean): Promise<EspRelayStatus> {
    return EspApiServiceMock.relayStatus;
  }

  async calcAvgVoltage(
    pzemData: EspSensorsData,
    config: SensorsAvgVoltageConfig,
  ): Promise<void> {
    return Promise.resolve(undefined);
  }
}
