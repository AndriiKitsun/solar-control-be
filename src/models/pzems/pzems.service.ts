import { Injectable } from '@nestjs/common';
import { CreatePzemDto } from './dto/request/create-pzem.dto';
import { PzemDto } from './dto/request/pzem.dto';
import { Pzem } from './entities/pzem.entity';
import { PzemRecordResponseDto } from './dto/response/pzem-record.dto';
import { PzemsRepository } from './pzems.repository';
import { plainToInstance } from 'class-transformer';
import { PzemRecord } from './entities/pzem-record.entity';
import { TEN_MINUTES_RECORDS_AMOUNT } from './pzems.constants';

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
    const { input, output, accOutput, solarOutput, creationTimeGmt } = pzemDto;
    const shouldGetRecords =
      !!input.voltageV ||
      !!output.voltageV ||
      !!accOutput.voltageV ||
      !!solarOutput.voltageV;

    const records = shouldGetRecords
      ? await this.pzemSensorRepository.getLast10minutesRecords()
      : [];

    let inputAvgV = 0;
    let outputAvgV = 0;
    let accOutputAvgV = 0;
    let solarOutputAvgV = 0;

    if (records.length === TEN_MINUTES_RECORDS_AMOUNT) {
      let inputVSum = 0;
      let outputVSum = 0;
      let accOutputVSum = 0;
      let solarOutputVSum = 0;

      records.forEach((pzem) => {
        inputVSum += pzem.input.voltageV;
        outputVSum += pzem.output.voltageV;
        accOutputVSum += pzem.accOutput.voltageV;
        solarOutputVSum += pzem.solarOutput.voltageV;
      });

      inputAvgV = inputVSum / records.length;
      outputAvgV = outputVSum / records.length;
      accOutputAvgV = accOutputVSum / records.length;
      solarOutputAvgV = solarOutputVSum / records.length;
    }

    return {
      input: this.mapPzemDto(input, inputAvgV),
      output: this.mapPzemDto(output, outputAvgV),
      accOutput: this.mapPzemDto(accOutput, accOutputAvgV),
      solarOutput: this.mapPzemDto(solarOutput, solarOutputAvgV),
      creationTimeGmt: creationTimeGmt,
    };
  }

  private mapPzemDto(pzem: PzemDto, averageVoltage: number): Pzem {
    return {
      voltageV: pzem.voltageV,
      currentA: pzem.currentA,
      powerKw: pzem.powerKw,
      energyKwh: pzem.energyKwh,
      frequencyHz: pzem.frequencyHz,
      powerFactor: pzem.powerFactor,
      t1EnergyKwh: pzem.t1EnergyKwh,
      t2EnergyKwh: pzem.t2EnergyKwh,
      avg10minutesVoltageV: averageVoltage,
    };
  }
}
