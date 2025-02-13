import { ClassMock } from '@common/types/test.types';
import { PzemsGateway } from '../../../../src/modules/pzems';

export class PzemsGatewayMock implements ClassMock<PzemsGateway> {
  emitData(message: string): void {}
}
