import { Injectable } from '@nestjs/common';
import { CreatePzemRecordDto } from './dto/request/create-pzem-record.dto';
import { join } from 'node:path';
import { appendFileSync, existsSync, mkdirSync } from 'node:fs';

@Injectable()
export class PzemsFileService {
  private fileName = `pzems-${new Date().toJSON()}.json`;

  savePzemToFileV2(pzemData: CreatePzemRecordDto): void {
    const outDir = 'output';
    const outPath = join(outDir, this.fileName);
    const content = JSON.stringify(pzemData) + ',\n';

    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
    }

    appendFileSync(outPath, content);
  }
}
