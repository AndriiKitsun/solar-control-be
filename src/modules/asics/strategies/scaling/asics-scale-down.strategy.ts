import { Injectable } from '@nestjs/common';
import { ControlRule } from '../../../automation/control-rule/entities';

@Injectable()
export class AsicsScaleDownStrategy {
  run(rule: ControlRule): Promise<void> {
    console.log(`${new Date().toJSON()} AsicsScaleDownStrategy -->`, rule);

    return Promise.resolve();
  }
}
