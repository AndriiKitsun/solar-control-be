import { Test, TestingModule } from '@nestjs/testing';
import { PzemsGateway, PzemsService } from '@modules/pzems';
import { PzemsServiceMock } from './mocks/pzems.service.mock';

describe('PzemsGateway', () => {
  let gateway: PzemsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PzemsGateway,
        {
          provide: PzemsService,
          useClass: PzemsServiceMock,
        },
      ],
    }).compile();

    gateway = module.get(PzemsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
