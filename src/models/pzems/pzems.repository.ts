import { Injectable } from '@nestjs/common';
import { PzemRecord } from './entities/pzem-record.entity';

@Injectable()
export class PzemsRepository {
  private pzemRecordsDb: PzemRecord[] = [];

  async getAll(): Promise<PzemRecord[]> {
    return this.pzemRecordsDb;
  }

  async saveRecord(record: PzemRecord): Promise<void> {
    this.pzemRecordsDb.push(record);
  }

  async getLast10minutesRecords(): Promise<PzemRecord[]> {
    return this.pzemRecordsDb.filter((record) => {
      const recordDate = new Date(record.creationTimeGmt);
      const tenMinutesAgo = new Date();
      tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);

      return recordDate.getTime() >= tenMinutesAgo.getTime();
    });
  }
}
