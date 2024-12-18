import { WsClientService } from '@api/common/ws/ws-client.service';

jest.mock('ws');

class TestService extends WsClientService {
  constructor() {
    super('url');
  }

  protected handleMessage(data: any, rawMessage: string): void {}
}

describe('WsClientService', () => {
  let service: WsClientService;

  beforeEach(() => {
    service = new TestService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
