import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsRepository } from './logs.repository';
import { Log } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  controllers: [LogsController],
  providers: [LogsService, LogsRepository],
  exports: [LogsService],
})
export class LogsModule {}
