import { Module } from '@nestjs/common';
import { ProtectionRulesService } from './protection-rules.service';
import { ProtectionRulesController } from './protection-rules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProtectionRule } from './entities';
import { ProtectionRulesRepository } from './protection-rules.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProtectionRule])],
  controllers: [ProtectionRulesController],
  providers: [ProtectionRulesService, ProtectionRulesRepository],
})
export class ProtectionRulesModule {}
