import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { CreatePzemSensorDto } from './dto/request/create-pzem-sensor.dto';
import { PzemRecordResponseDto } from './dto/response/pzem-sensor.dto';

@Controller('sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}

  @Post('pzem')
  @HttpCode(HttpStatus.NO_CONTENT)
  async createPzem(@Body() pzemSensorDto: CreatePzemSensorDto): Promise<void> {
    return this.sensorsService.createPzem(pzemSensorDto);
  }

  @Get('pzem')
  async getAllPzemData(): Promise<PzemRecordResponseDto[]> {
    return this.sensorsService.getAllPzemData();
  }
}
