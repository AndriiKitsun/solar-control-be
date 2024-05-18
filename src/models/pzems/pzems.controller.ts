import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PzemsService } from './pzems.service';
import { CreatePzemDto } from './dto/request/create-pzem.dto';
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
  async createPzem(@Body() pzemDto: CreatePzemDto): Promise<void> {
    return this.pzemsService.createPzem(pzemDto);
  }

  @Get()
  async getAllPzems(): Promise<PzemRecordResponseDto[]> {
    return this.pzemsService.getAllPzems();
  }

  @Post('file')
  savePzemToFile(@Body() pzemData: CreatePzemDto): void {
    return this.pzemsFileService.savePzemToFileV2(pzemData);
  }
}
