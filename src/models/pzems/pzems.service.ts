import { Injectable } from '@nestjs/common';
import { CreatePzemRecordDto } from './dto/request/create-pzem-record.dto';
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

  async createPzem(pzemSensorDto: CreatePzemRecordDto): Promise<void> {
    const recalculatedPzemRecord = await this.calculatePzem(pzemSensorDto);

    await this.pzemSensorRepository.createPzemRecord(recalculatedPzemRecord);
  }

  async getAllPzems(): Promise<PzemRecordResponseDto[]> {
    const records = await this.pzemSensorRepository.getAllPzemRecords();

    return plainToInstance(PzemRecordResponseDto, records);
  }

  private async calculatePzem(
    pzemData: CreatePzemRecordDto,
  ): Promise<PzemRecord> {
    const lastDayPzems =
      await this.pzemSensorRepository.getPzemRecordsForLastDay();

    const t1Pzems: PzemRecord[] = [];
    const t2Pzems: PzemRecord[] = [];
    const last10MinutesPzems: PzemRecord[] = [];

    const t1StartTime = this.getT1StartTime();
    const t2StartTime = this.getT2StartTime();
    const last10MinutesTime = this.getLast10MinutesTime();

    lastDayPzems.forEach((pzem) => {
      const pzemTimeMs = new Date(pzem.recordTimeGmt).getTime();

      if (pzemTimeMs >= t1StartTime && pzemTimeMs < t2StartTime) {
        t1Pzems.push(pzem);
      } else if (pzemTimeMs >= t2StartTime && pzemTimeMs < t1StartTime) {
        t2Pzems.push(pzem);
      }

      if (pzemTimeMs >= last10MinutesTime) {
        last10MinutesPzems.push(pzem);
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
    last10MinutesPzems.forEach((pzem) => {
      inputAcVoltageSum += pzem.input.voltageV;
      outputAcVoltageSum += pzem.output.voltageV;
      batteryOutputDcVoltageSum += pzem.accOutput.voltageV;
      solarOutputDcVoltageSum += pzem.solarOutput.voltageV;
    });

    const inputAcAverageVoltage = inputAcVoltageSum / last10MinutesPzems.length;
    const outputAcAverageVoltage =
      outputAcVoltageSum / last10MinutesPzems.length;
    const batteryOutputDcAverageVoltage =
      batteryOutputDcVoltageSum / last10MinutesPzems.length;
    const solarOutputDcAverageVoltage =
      solarOutputDcVoltageSum / last10MinutesPzems.length;

    return {
      input: this.calculatePzemParams(pzemData.input, inputAcAverageVoltage),
      output: this.calculatePzemParams(pzemData.output, outputAcAverageVoltage),
      accOutput: this.calculatePzemParams(
        pzemData.accOutput,
        batteryOutputDcAverageVoltage,
      ),
      solarOutput: this.calculatePzemParams(
        pzemData.solarOutput,
        solarOutputDcAverageVoltage,
      ),
      recordTimeGmt: pzemData.recordTimeGmt,
    };
  }

  private getT1StartTime(): number {
    const now = new Date();

    now.setHours(ENERGY_COUNTER_T1_UA_ZONE_START_HOUR, 0, 0, 0);

    return now.getTime();
  }

  private getT2StartTime(): number {
    const now = new Date();

    now.setHours(ENERGY_COUNTER_T2_UA_ZONE_START_HOUR, 0, 0, 0);

    return now.getTime();
  }

  private getLast10MinutesTime(): number {
    const now = new Date();

    now.setMinutes(now.getMinutes() - 10);

    return now.getTime();
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
