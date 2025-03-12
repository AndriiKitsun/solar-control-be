import { Module } from '@nestjs/common';
import { RelaysController } from './relays.controller';
import { RelaysService } from './relays.service';
import { EspApiModule } from '@api/modules/esp';

@Module({
  imports: [EspApiModule],
  controllers: [RelaysController],
  providers: [RelaysService],
})
export class RelaysModule {}
