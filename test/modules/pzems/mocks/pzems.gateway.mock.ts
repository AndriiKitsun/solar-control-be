import { ClassMock } from '@common/types/test.types';
import { PzemsGateway } from '@modules/pzems';
import { EspSensorsData } from '@api/modules';

export class PzemsGatewayMock implements ClassMock<PzemsGateway> {
  async handleEspMessage(data: EspSensorsData, raw: string): Promise<void> {
    return;
  }
}
