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

  async getRecordsForLastDay(): Promise<PzemRecord[]> {
    return this.pzemRecordsDb.filter((record) => {
      const recordDate = new Date(record.creationTimeGmt);
      const lastDay = new Date();
      lastDay.setDate(lastDay.getDate() - 1);

      return recordDate.getTime() >= lastDay.getTime();
    });
  }
}
