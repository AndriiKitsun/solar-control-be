import { Injectable } from '@nestjs/common';
import { CreatePzemDto } from './dto/request/create-pzem.dto';
import { PzemDto } from './dto/request/pzem.dto';
import { Pzem } from './entities/pzem.entity';
import { PzemRecordResponseDto } from './dto/response/pzem-record.dto';
import { PzemsRepository } from './pzems.repository';
import { plainToInstance } from 'class-transformer';
import {
  ENERGY_COUNTER_T1_UA_ZONE_START_HOUR,
  ENERGY_COUNTER_T2_UA_ZONE_START_HOUR,
} from './pzems.constants';
import { PzemRecord } from './entities/pzem-record.entity';

@Injectable()
export class PzemsService {
  constructor(private readonly pzemSensorRepository: PzemsRepository) {}

  async createPzem(pzemDto: CreatePzemDto): Promise<void> {
    const pzemRecord = await this.calculatePzem(pzemDto);

    await this.pzemSensorRepository.saveRecord(pzemRecord);
  }

  async getAllPzems(): Promise<PzemRecordResponseDto[]> {
    const records = await this.pzemSensorRepository.getAll();

    return plainToInstance(PzemRecordResponseDto, records);
  }

  private async calculatePzem(pzemDto: CreatePzemDto): Promise<PzemRecord> {
    const records = await this.pzemSensorRepository.getRecordsForLastDay();

    const t1Records: PzemRecord[] = [];
    const t2Records: PzemRecord[] = [];
    const last10mRecords: PzemRecord[] = [];

    const t1StartDate = this.getT1StartTime();
    const t2StartDate = this.getT2StartTime();
    const last10MinutesDate = this.getLast10MinutesTime();

    const t1StartTime = t1StartDate.getTime();
    const t2StartTime = t2StartDate.getTime();
    const last10MinutesTime = last10MinutesDate.getTime();

    records.forEach((record) => {
      const recordTime = new Date(record.creationTimeGmt).getTime();

      if (recordTime >= t1StartTime && recordTime < t2StartTime) {
        t1Records.push(record);
      } else if (recordTime >= t2StartTime && recordTime < t1StartTime) {
        t2Records.push(record);
      }

      if (recordTime >= last10MinutesTime) {
        last10mRecords.push(record);
      }
    });

    let inputAcVoltageSum = 0;
    let outputAcVoltageSum = 0;
    let batteryOutputDcVoltageSum = 0;
    let solarOutputDcVoltageSum = 0;

    // TBD: how to calculate T1, T2 params
    // t1Pzems.forEach(pzem => {
    //   t1Sum += pzem.inputAc.activeEnergyKwh;
    //   t2Sum += pzem.outputAc.activeEnergyKwh;
    //   t2Sum += pzem.batteryOutputDc.activeEnergyKwh;
    //   t2Sum += pzem.solarOutputDc.activeEnergyKwh;
    // });
    //
    // t2Pzems.forEach(pzem => {
    //   t1Sum += pzem.inputAc.activeEnergyKwh;
    //   t2Sum += pzem.outputAc.activeEnergyKwh;
    //   t2Sum += pzem.batteryOutputDc.activeEnergyKwh;
    //   t2Sum += pzem.solarOutputDc.activeEnergyKwh;
    // });
    //
    last10mRecords.forEach((pzem) => {
      inputAcVoltageSum += pzem.input.voltageV;
      outputAcVoltageSum += pzem.output.voltageV;
      batteryOutputDcVoltageSum += pzem.accOutput.voltageV;
      solarOutputDcVoltageSum += pzem.solarOutput.voltageV;
    });

    const inputAcAverageVoltage = inputAcVoltageSum / last10mRecords.length;
    const outputAcAverageVoltage = outputAcVoltageSum / last10mRecords.length;
    const batteryOutputDcAverageVoltage =
      batteryOutputDcVoltageSum / last10mRecords.length;
    const solarOutputDcAverageVoltage =
      solarOutputDcVoltageSum / last10mRecords.length;

    return {
      input: this.calculatePzemParams(pzemDto.input, inputAcAverageVoltage),
      output: this.calculatePzemParams(pzemDto.output, outputAcAverageVoltage),
      accOutput: this.calculatePzemParams(
        pzemDto.accOutput,
        batteryOutputDcAverageVoltage,
      ),
      solarOutput: this.calculatePzemParams(
        pzemDto.solarOutput,
        solarOutputDcAverageVoltage,
      ),
      creationTimeGmt: pzemDto.creationTimeGmt,
    };
  }

  private getT1StartTime(): Date {
    const now = new Date();

    now.setHours(ENERGY_COUNTER_T1_UA_ZONE_START_HOUR, 0, 0, 0);

    return now;
  }

  private getT2StartTime(): Date {
    const now = new Date();

    now.setHours(ENERGY_COUNTER_T2_UA_ZONE_START_HOUR, 0, 0, 0);

    return now;
  }

  private getLast10MinutesTime(): Date {
    const now = new Date();

    now.setMinutes(now.getMinutes() - 10);

    return now;
  }

  private calculatePzemParams(pzem: PzemDto, averageVoltage: number): Pzem {
    return {
      voltageV: pzem.voltageV,
      currentA: pzem.currentA,
      powerKw: pzem.powerKw,
      energyKwh: pzem.energyKwh,
      frequencyHz: pzem.frequencyHz,
      powerFactor: pzem.powerFactor,
      t1EnergyKwh: 0,
      t2EnergyKwh: 0,
      avg10mVoltageV: averageVoltage,
    };
  }
}
