import { Test, TestingModule } from '@nestjs/testing';
import { HttpApiService } from './http-api.service';
import { HttpService } from '@nestjs/axios';
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
