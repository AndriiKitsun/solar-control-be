import { ClassMock } from '@common/types/test.types';
import { SensorsRepository } from '@modules/sensors/sensors.repository';
import { Sensor } from '@modules/sensors/entities';

export class SensorsRepositoryMock implements ClassMock<SensorsRepository> {
  static readonly sensorMock: Sensor = {
    id: 'id',
    createdAt: new Date(),
    sensors: [],
  };
  static readonly sensorsMock: Sensor[] = [this.sensorMock];

  async save(sensorsData: Sensor): Promise<Sensor> {
    return SensorsRepositoryMock.sensorMock;
  }

  async findAllBefore(date: string, seconds: number): Promise<Sensor[]> {
    return SensorsRepositoryMock.sensorsMock;
  }

  async deleteAll(): Promise<void> {
    return;
  }
}
