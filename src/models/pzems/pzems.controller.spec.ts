import { Test, TestingModule } from '@nestjs/testing';
import { PzemsController } from './pzems.controller';
import { PzemsService, PzemsFileService } from './services';

describe('PzemsController', () => {
  let controller: PzemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PzemsController],
      providers: [
        {
          provide: PzemsService,
          useValue: {},
        },
        {
          provide: PzemsFileService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<PzemsController>(PzemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
