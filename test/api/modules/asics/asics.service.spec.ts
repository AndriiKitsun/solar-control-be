import { Test, TestingModule } from '@nestjs/testing';
import { HttpClientService } from '@api/common';
import { AsicsApiService } from '@api/modules';
import { HttpApiServiceMock } from '../../common/modules/http-api/mocks/http-api.service.mock';

describe('AsicsApiService', () => {
  let service: AsicsApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AsicsApiService,
        {
          provide: HttpClientService,
          useClass: HttpApiServiceMock,
        },
      ],
    }).compile();

    service = module.get(AsicsApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
