import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities';
import { SaveSettingDto } from './dto';
import { plainToInstance } from 'class-transformer';
import { toError } from '@common/utils';

@Injectable()
export class SettingsRepository {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) {}

  async create(saveSettingDto: SaveSettingDto): Promise<Setting> {
    try {
      await this.settingRepository.insert(saveSettingDto);

      return plainToInstance(Setting, saveSettingDto);
    } catch (error) {
      throw new BadRequestException(toError((error as Error).message));
    }
  }

  async getSettings(): Promise<Setting> {
    const setting = await this.settingRepository.find();

    if (!setting.length) {
      return this.create({});
    }

    return setting[0];
  }

  async update(id: string, updateSettingDto: SaveSettingDto): Promise<Setting> {
    const result = await this.settingRepository.update(id, updateSettingDto);

    if (!result.affected) {
      throw new NotFoundException(
        toError(`Setting with '${id}' id does not exist`),
      );
    }

    return this.getSettings();
  }
}
