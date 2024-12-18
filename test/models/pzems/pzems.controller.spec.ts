import { Test, TestingModule } from '@nestjs/testing';
import { PzemsController, PzemsService } from '@models/pzems';
import { PzemsServiceMock } from './services/mocks/pzems.service.mock';

describe('PzemsController', () => {
  let controller: PzemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PzemsController,
        {
          provide: PzemsService,
          useClass: PzemsServiceMock,
        },
      ],
    }).compile();

    controller = module.get(PzemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
