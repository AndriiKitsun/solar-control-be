import { ClassMock } from '@common/types/test.types';
import { PzemsGateway } from '@models/pzems';

export class PzemsGatewayMock implements ClassMock<PzemsGateway> {
  emitData(message: string): void {}
}
