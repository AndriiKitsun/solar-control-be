import { Injectable } from '@nestjs/common';
import { CreateEspPhase1PzemDto } from './dto/create-esp-phase-1-pzem.dto';

@Injectable()
export class EspPhase1Service {
  private pzemDataDb: CreateEspPhase1PzemDto[] = [];

  createPzem(pzemDto: CreateEspPhase1PzemDto): void {
    this.pzemDataDb.unshift(pzemDto);
  }

  findAll(): CreateEspPhase1PzemDto[] {
    return this.pzemDataDb;
  }
}
