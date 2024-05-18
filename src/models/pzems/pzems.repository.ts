import { Injectable } from '@nestjs/common';
import { PzemRecord } from './entities/pzem-record.entity';

@Injectable()
export class PzemsRepository {
  private pzemSensorsDb: PzemRecord[] = [];

  async getAllPzemRecords(): Promise<PzemRecord[]> {
    return this.pzemSensorsDb;
  }

  async createPzemRecord(pzem: PzemRecord): Promise<void> {
    this.pzemSensorsDb.push(pzem);
  }

  async getPzemRecordsForLastDay(): Promise<PzemRecord[]> {
    return this.pzemSensorsDb.filter((pzemSensor) => {
      const recordDate = new Date(pzemSensor.recordTimeGmt);
      const lastDay = new Date();
      lastDay.setDate(lastDay.getDate() - 1);

      return recordDate.getTime() >= lastDay.getTime();
    });
  }
}
