import { Injectable } from '@nestjs/common';
import { AsicsScaleStrategy } from '../../types/asics-scale.strategy';
import { ControlRule } from '../../../automation/control-rule/entities';

@Injectable()
export class AsicsScaleDownStrategy extends AsicsScaleStrategy {
  run(rule: ControlRule): void {
    console.log(`${new Date().toJSON()} AsicsScaleDownStrategy -->`, rule);
  }
}
