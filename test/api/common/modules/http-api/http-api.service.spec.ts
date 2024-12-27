import { HttpClientService } from '@api/common/services/http-client.service';
import { HttpService } from '@nestjs/axios';
import { TestingModule, Test } from '@nestjs/testing';
import { HttpServiceMock } from './mocks/http-service.mock';

describe('HttpApiService', () => {
  let service: HttpClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HttpClientService,
        {
          provide: HttpService,
          useClass: HttpServiceMock,
        },
      ],
    }).compile();

    service = module.get(HttpClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
