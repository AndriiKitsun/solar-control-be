import { AsicsScaleStrategy } from '../../types/asics-scale.strategy';
import { Injectable } from '@nestjs/common';
import { ControlRule } from '../../../automation/control-rule/entities';

@Injectable()
export class AsicsScaleUpStrategy extends AsicsScaleStrategy {
  run(rule: ControlRule): void {
    console.log(`${new Date().toJSON()} AsicsScaleUpStrategy -->`, rule);
  }
}
