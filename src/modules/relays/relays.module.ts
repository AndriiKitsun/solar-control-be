import { Module } from '@nestjs/common';
import { RelaysController } from './relays.controller';
import { RelaysService } from './relays.service';
import { EspApiModule } from '@api/modules/esp';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [EspApiModule, LogsModule],
  controllers: [RelaysController],
  providers: [RelaysService],
  exports: [RelaysService],
})
export class RelaysModule {}
