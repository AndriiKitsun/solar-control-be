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
import { SinglePzemDto } from './dto/request/single-pzem.dto';

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

  @Post('single')
  @HttpCode(HttpStatus.NO_CONTENT)
  logSinglePzem(@Body() pzemDto: SinglePzemDto): void {
    console.log(`pzemDto -->`, pzemDto);
  }

  @Post('single/file')
  saveSinglePzem(@Body() pzemDto: SinglePzemDto): void {
    this.pzemsFileService.saveSinglePzemToFile(pzemDto);

    console.log('LOG:', new Date(), 'saved');
  }

  @Get()
  async getAllPzems(): Promise<PzemRecordResponseDto[]> {
    return this.pzemsService.getAllPzems();
  }

  @Post('file')
  savePzemToFile(@Body() pzemData: CreatePzemDto): void {
    return this.pzemsFileService.savePzemDateToFile(pzemData);
  }
}
