import { Test, TestingModule } from '@nestjs/testing';
import { SettingsController } from '@models/settings/settings.controller';
import { SettingsService } from '@models/settings/settings.service';

describe('SettingsController', () => {
  let controller: SettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingsController],
      providers: [SettingsService],
    }).compile();

    controller = module.get<SettingsController>(SettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
