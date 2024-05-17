import { Injectable } from '@nestjs/common';
import { CreatePzemSensorDto } from './dto/request/create-pzem-sensor.dto';
import { PzemSensor } from './entities/pzem-sensor.entity';
import { PzemDto } from './dto/request/pzem.dto';
import { Pzem } from './entities/pzem.entity';
import { PzemRecordResponseDto } from './dto/response/pzem-sensor.dto';
import { PzemSensorRepository } from './pzem-sensor.repository';
import { plainToInstance } from 'class-transformer';
import {
  ENERGY_COUNTER_T1_UA_ZONE_START_HOUR,
  ENERGY_COUNTER_T2_UA_ZONE_START_HOUR,
} from './sensors.constants';

@Injectable()
export class SensorsService {
  constructor(private readonly pzemSensorRepository: PzemSensorRepository) {}

  async createPzem(pzemSensorDto: CreatePzemSensorDto): Promise<void> {
    const recalculatedPzemRecord = await this.calculatePzem(pzemSensorDto);

    await this.pzemSensorRepository.createPzemRecord(recalculatedPzemRecord);
  }

  async getAllPzemData(): Promise<PzemRecordResponseDto[]> {
    const records = await this.pzemSensorRepository.getAllPzemRecords();

    return plainToInstance(PzemRecordResponseDto, records);
  }

  private async calculatePzem(
    pzemData: CreatePzemSensorDto,
  ): Promise<PzemSensor> {
    const lastDayPzems =
      await this.pzemSensorRepository.getPzemRecordsForLastDay();

    const t1Pzems: PzemSensor[] = [];
    const t2Pzems: PzemSensor[] = [];
    const last10MinutesPzems: PzemSensor[] = [];

    const t1StartTime = this.getT1StartTime();
    const t2StartTime = this.getT2StartTime();
    const last10MinutesTime = this.getLast10MinutesTime();

    lastDayPzems.forEach((pzem) => {
      const pzemTimeMs = new Date(pzem.recordDateGmt).getTime();

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
      inputAcVoltageSum += pzem.inputAc.voltageV;
      outputAcVoltageSum += pzem.outputAc.voltageV;
      batteryOutputDcVoltageSum += pzem.batteryOutputDc.voltageV;
      solarOutputDcVoltageSum += pzem.solarOutputDc.voltageV;
    });

    const inputAcAverageVoltage = inputAcVoltageSum / last10MinutesPzems.length;
    const outputAcAverageVoltage =
      outputAcVoltageSum / last10MinutesPzems.length;
    const batteryOutputDcAverageVoltage =
      batteryOutputDcVoltageSum / last10MinutesPzems.length;
    const solarOutputDcAverageVoltage =
      solarOutputDcVoltageSum / last10MinutesPzems.length;

    return {
      inputAc: this.calculatePzemParams(
        pzemData.inputAc,
        inputAcAverageVoltage,
      ),
      outputAc: this.calculatePzemParams(
        pzemData.outputAc,
        outputAcAverageVoltage,
      ),
      batteryOutputDc: this.calculatePzemParams(
        pzemData.batteryOutputDc,
        batteryOutputDcAverageVoltage,
      ),
      solarOutputDc: this.calculatePzemParams(
        pzemData.solarOutputDc,
        solarOutputDcAverageVoltage,
      ),
      recordDateGmt: pzemData.recordDateGmt,
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
    const { activePowerW } = pzem;
    const activePowerKw = activePowerW / 1000;

    return {
      voltageV: pzem.voltageV,
      currentA: pzem.currentA,
      activePowerKw,
      activeEnergyKwh: pzem.activeEnergyKwh,
      frequencyHz: pzem.frequencyHz,
      powerFactor: pzem.powerFactor,
      energyT1Kwh: 0,
      energyT2Kwh: 0,
      tenMinutesAverageVoltageV: averageVoltage,
    };
  }
}
