import { Injectable } from '@nestjs/common';
import { CreatePzemDto } from './dto/request/create-pzem.dto';
import { join } from 'node:path';
import { appendFileSync, existsSync, mkdirSync } from 'node:fs';
import { SinglePzemDto } from './dto/request/single-pzem.dto';

@Injectable()
export class PzemsFileService {
  private fileName = `pzems-${new Date().toJSON()}.json`;
  private singlePzemFileName = `raw-pzem-${new Date().toJSON()}.json`;

  savePzemDateToFile(pzemData: CreatePzemDto): void {
    const outDir = 'output';
    const outPath = join(outDir, this.fileName);
    const content = JSON.stringify(pzemData) + ',\n';

    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
    }

    appendFileSync(outPath, content);
  }

  saveSinglePzemToFile(pzemData: SinglePzemDto): void {
    const outDir = 'output';
    const outPath = join(outDir, this.singlePzemFileName);
    const content = JSON.stringify(pzemData) + ',\n';

    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
    }

    appendFileSync(outPath, content);
  }
}
