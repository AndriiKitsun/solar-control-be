import { Test, TestingModule } from '@nestjs/testing';
import { PzemsController } from './pzems.controller';
import { PzemsService } from './pzems.service';

describe('PzemsController', () => {
  let controller: PzemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PzemsController],
      providers: [PzemsService],
    }).compile();

    controller = module.get<PzemsController>(PzemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
