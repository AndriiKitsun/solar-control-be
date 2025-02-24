import { ClassMock } from '@common/types/test.types';
import { PzemsService } from '@modules/pzems';
import { EspPzemCounter } from '@api/modules/esp';
import { EspPzemsServiceMock } from '@api/modules/esp/collections/pzems/mocks/pzems.service.mock';

export class PzemsServiceMock implements ClassMock<PzemsService> {
  async resetEnergyCounter(): Promise<EspPzemCounter[]> {
    return EspPzemsServiceMock.resetCounterResponseMock;
  }
}
