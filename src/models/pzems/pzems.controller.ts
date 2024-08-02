import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PzemsService, PzemsFileService } from './services';
import { PzemResponseDto, PzemDto } from './dto';

@Controller('pzems')
export class PzemsController {
  constructor(
    private readonly pzemsService: PzemsService,
    private readonly pzemsFileService: PzemsFileService,
  ) {}

  @Get()
  getAllPzems(): Promise<PzemResponseDto[]> {
    return this.pzemsService.getAllPzems();
  }

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  createPzem(@Body() pzemDto: PzemDto): Promise<void> {
    return this.pzemsService.createPzem(pzemDto);
  }

  @Post('file')
  @HttpCode(HttpStatus.NO_CONTENT)
  savePzemToFile(@Body() pzemDto: PzemDto): void {
    this.pzemsFileService.savePzemToFile(pzemDto);
  }
}
