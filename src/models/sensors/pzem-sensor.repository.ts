import { Injectable } from '@nestjs/common';
import { PzemSensor } from './entities/pzem-sensor.entity';

@Injectable()
export class PzemSensorRepository {
  private pzemSensorsDb: PzemSensor[] = [];

  async getAllPzemRecords(): Promise<PzemSensor[]> {
    return this.pzemSensorsDb;
  }

  async createPzemRecord(pzem: PzemSensor): Promise<void> {
    this.pzemSensorsDb.push(pzem);
  }

  async getPzemRecordsForLastDay(): Promise<PzemSensor[]> {
    return this.pzemSensorsDb.filter((pzemSensor) => {
      const recordDate = new Date(pzemSensor.recordDateGmt);
      const lastDay = new Date();
      lastDay.setDate(lastDay.getDate() - 1);

      return recordDate.getTime() >= lastDay.getTime();
    });
  }
}
