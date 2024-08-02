import { Injectable } from '@nestjs/common';
import { PzemDto } from '../dto';

@Injectable()
export class PzemsCalculationService {
  private readonly tenMinPzemCount = 600;

  private last10MinPzems: PzemDto[] = [];

  calcAvgVoltage(pzem: PzemDto): number {
    if (!pzem.voltageV) {
      this.last10MinPzems.length = 0;
    }

    if (this.last10MinPzems.length < this.tenMinPzemCount) {
      this.last10MinPzems.push(pzem);

      return 0;
    } else {
      const sum = this.last10MinPzems.reduce(
        (acc, pzem) => acc + pzem.voltageV!,
        0,
      );
      const avgVoltage = sum / this.last10MinPzems.length;

      this.last10MinPzems.shift();
      this.last10MinPzems.push(pzem);

      return avgVoltage;
    }
  }
}
