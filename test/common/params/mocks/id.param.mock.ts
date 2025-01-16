import { IdParams } from '@common/params';

export class IdParamMock {
  static readonly idMock = '54d45a50-4a7b-28ea-96d8-ac57b16b4a0d';

  static readonly idParamsMock: IdParams = {
    id: this.idMock,
  };
}
