import { Injectable } from '@nestjs/common';
import { PzemDto } from '../dto/request/pzem.dto';
import { join } from 'node:path';
import { appendFileSync, existsSync, mkdirSync } from 'node:fs';

@Injectable()
export class PzemsFileService {
  private fileName = `pzem-${new Date().toJSON()}.json`;

  savePzemToFile(pzemData: PzemDto): void {
    const outDir = 'output';
    const outPath = join(outDir, this.fileName);
    const content = JSON.stringify(pzemData) + ',\n';

    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
    }

    appendFileSync(outPath, content);
  }
}
