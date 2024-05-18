import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PzemsService } from './pzems.service';
import { CreatePzemDto } from './dto/request/create-pzem.dto';
import { PzemRecordResponseDto } from './dto/response/pzem-record.dto';
import { PzemsFileService } from './pzems-file.service';
import { SinglePzemDto } from './dto/request/single-pzem.dto';

@Controller('pzems')
export class PzemsController {
  private logger = new Logger(PzemsController.name);

  constructor(
    private readonly pzemsService: PzemsService,
    private readonly pzemsFileService: PzemsFileService,
  ) {}

  @Get()
  async getAllPzems(): Promise<PzemRecordResponseDto[]> {
    return this.pzemsService.getAllPzems();
  }

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async createPzem(@Body() pzemDto: CreatePzemDto): Promise<void> {
    return this.pzemsService.createPzem(pzemDto);
  }

  @Post('file')
  savePzemToFile(@Body() pzemData: CreatePzemDto): void {
    this.pzemsFileService.savePzemDateToFile(pzemData);

    this.logger.debug('Saved PZEM DTO data');
  }

  @Post('single/file')
  saveSinglePzem(@Body() pzemDto: SinglePzemDto): void {
    this.pzemsFileService.saveSinglePzemToFile(pzemDto);

    this.logger.debug('Saved PZEM item');
  }
}
