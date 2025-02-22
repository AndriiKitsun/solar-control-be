import { AbstractWsService } from '@api/services/abstract-ws.service';

jest.mock('ws');

class TestService extends AbstractWsService {
  constructor() {
    super('url');
  }

  protected handleMessage(data: any, rawMessage: string): void {}
}

describe('WsClientService', () => {
  let service: AbstractWsService;

  beforeEach(() => {
    service = new TestService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
