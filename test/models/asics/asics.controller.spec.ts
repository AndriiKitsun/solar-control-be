import { Test, TestingModule } from '@nestjs/testing';
import { AsicsService, AsicsController } from '@models/asics';
import { AsicsServiceMock } from './mocks/asics.service.mock';

describe('AsicsController', () => {
  let controller: AsicsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AsicsController,
        {
          provide: AsicsService,
          useClass: AsicsServiceMock,
        },
      ],
    }).compile();

    controller = module.get(AsicsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
