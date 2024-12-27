import { Test, TestingModule } from '@nestjs/testing';
import { AsicsApiService } from '@api/modules';
import { HttpService } from '@nestjs/axios';
import { HttpServiceMock } from '../../common/services/mocks/http-service.mock';

describe('AsicsApiService', () => {
  let service: AsicsApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AsicsApiService,
        {
          provide: HttpService,
          useClass: HttpServiceMock,
        },
      ],
    }).compile();

    service = module.get(AsicsApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
