import { Injectable } from '@nestjs/common';
import { AsicsScaleStrategy } from '../../types/asic-scaling.types';
import { ControlRule } from '../../../automation/control-rule/entities';

@Injectable()
export class AsicsScaleDownStrategy implements AsicsScaleStrategy {
  run(rule: ControlRule): Promise<void> {
    console.log(`${new Date().toJSON()} AsicsScaleDownStrategy -->`, rule);

    return Promise.resolve();
  }
}
