import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Setting } from './entities';
import { IdParams } from '@common/params';
import { SaveSettingDto } from './dto';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getSettings(): Promise<Setting> {
    return this.settingsService.getSettings();
  }

  @Patch(':id')
  updateSettings(
    @Param() params: IdParams,
    @Body() saveSettingDto: SaveSettingDto,
  ): Promise<Setting> {
    return this.settingsService.update(params.id, saveSettingDto);
  }
}
