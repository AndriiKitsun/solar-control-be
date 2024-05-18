import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PzemsService } from './pzems.service';
import { CreatePzemRecordDto } from './dto/request/create-pzem-record.dto';
import { PzemRecordResponseDto } from './dto/response/pzem-record.dto';
import { PzemsFileService } from './pzems-file.service';

@Controller('pzems')
export class PzemsController {
  constructor(
    private readonly pzemsService: PzemsService,
    private readonly pzemsFileService: PzemsFileService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async createPzem(@Body() pzemData: CreatePzemRecordDto): Promise<void> {
    return this.pzemsService.createPzem(pzemData);
  }

  @Get()
  async getAllPzems(): Promise<PzemRecordResponseDto[]> {
    return this.pzemsService.getAllPzems();
  }

  @Post('file')
  savePzemToFile(@Body() pzemData: CreatePzemRecordDto): void {
    return this.pzemsFileService.savePzemToFileV2(pzemData);
  }
}
