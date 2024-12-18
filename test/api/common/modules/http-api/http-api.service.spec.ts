import { HttpApiService } from '@api/common/modules/http-api/http-api.service';
import { HttpService } from '@nestjs/axios';
import { TestingModule, Test } from '@nestjs/testing';
import { HttpServiceMock } from './mocks/http-service.mock';

describe('HttpApiService', () => {
  let service: HttpApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HttpApiService,
        {
          provide: HttpService,
          useClass: HttpServiceMock,
        },
      ],
    }).compile();

    service = module.get(HttpApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
