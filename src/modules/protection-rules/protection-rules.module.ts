import { Module } from '@nestjs/common';
import { ProtectionRulesService } from './protection-rules.service';
import { ProtectionRulesController } from './protection-rules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProtectionRule } from './entities';
import { ProtectionRulesRepository } from './protection-rules.repository';
import { EspApiModule } from '@api/modules/esp';

@Module({
  imports: [TypeOrmModule.forFeature([ProtectionRule]), EspApiModule],
  controllers: [ProtectionRulesController],
  providers: [ProtectionRulesService, ProtectionRulesRepository],
})
export class ProtectionRulesModule {}
