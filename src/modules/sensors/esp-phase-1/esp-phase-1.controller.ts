import { Controller, Get, Post, Body } from '@nestjs/common';
import { EspPhase1Service } from './esp-phase-1.service';
import { CreateEspPhase1PzemDto } from './dto/create-esp-phase-1-pzem.dto';

@Controller()
export class EspPhase1Controller {
  constructor(private readonly espPhase1Service: EspPhase1Service) {}

  @Post()
  createPzem(@Body() createEspPhase1PzemDto: CreateEspPhase1PzemDto) {
    return this.espPhase1Service.createPzem(createEspPhase1PzemDto);
  }

  @Get()
  findAll() {
    return this.espPhase1Service.findAll();
  }
}
