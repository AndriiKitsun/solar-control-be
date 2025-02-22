import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Sse,
  MessageEvent,
  Query,
} from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogDto } from './dto';
import { Log } from './entities';
import { Observable } from 'rxjs';
import { LogParams } from './params';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  getLogs(@Query() params: LogParams): Promise<Log[]> {
    return this.logsService.getLogs(params);
  }

  @Sse('sse')
  getLogStream(): Observable<MessageEvent> {
    return this.logsService.getLogStream();
  }

  @Post()
  saveLog(@Body() logDto: LogDto): Promise<void> {
    return this.logsService.saveLog(logDto);
  }

  @Delete()
  deleteLogs(): Promise<void> {
    return this.logsService.deleteLogs();
  }
}
