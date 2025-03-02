import { Injectable } from '@nestjs/common';
import { CreateAsicDto, UpdateAsicDto, AsicSummaryResponseDto } from './dto';
import { AsicsRepository } from './asics.repository';
import { AsicsApiService } from '@api/modules';
import { Asic } from './entities';
import { encrypt, decrypt } from '@common/utils';
import { DateMilliseconds } from '@common/enums/date.enum';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AsicsService {
  constructor(
    private readonly asicsRepository: AsicsRepository,
    private readonly asicsApiService: AsicsApiService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  async startAsics(): Promise<void> {
    const asics = await this.asicsRepository.findAllT2Active();

    for (const asic of asics) {
      const { token } = await this.asicsApiService.login(
        asic.ip,
        decrypt(asic.password),
      );

      await this.asicsApiService.start(asic.ip, token);
    }
  }

  async create(createAsicDto: CreateAsicDto): Promise<Asic> {
    const { ip, password } = createAsicDto;

    const auth = await this.asicsApiService.login(ip, password);
    const info = await this.asicsApiService.getInfo(ip);

    const payload: Partial<Asic> = {
      ...createAsicDto,
      password: encrypt(createAsicDto.password),
      token: auth.token,
      hostname: info.system?.network_status.hostname,
    };

    return this.asicsRepository.create(payload);
  }

  findAll(): Promise<Asic[]> {
    return this.asicsRepository.findAll();
  }

  update(id: string, updateAsicDto: UpdateAsicDto): Promise<Asic> {
    if (updateAsicDto.password) {
      updateAsicDto.password = encrypt(updateAsicDto.password);
    }

    return this.asicsRepository.update(id, updateAsicDto);
  }

  delete(id: string): Promise<void> {
    return this.asicsRepository.delete(id);
  }

  async start(id: string): Promise<void> {
    const asic = await this.asicsRepository.findOne(id);

    return this.asicsApiService.start(asic.ip, asic.token);
  }

  async stop(id: string): Promise<void> {
    const asic = await this.asicsRepository.findOne(id);

    return this.asicsApiService.stop(asic.ip, asic.token);
  }

  async getSummary(id: string): Promise<AsicSummaryResponseDto> {
    const asic = await this.asicsRepository.findOne(id);
    const summary = await this.asicsApiService.getSummary(asic.ip);
    const perfSummary = await this.asicsApiService.getPerfSummary(asic.ip);

    const response: AsicSummaryResponseDto = {
      hostname: asic.hostname,
      ip: asic.ip,
      status: {
        state: summary?.miner_status.miner_state,
        ...this.calcStateTime(summary?.miner_status.miner_state_time),
      },
      avgHashRate: summary?.average_hashrate,
      maxChipTemp: summary?.chip_temp.max,
      powerConsumption: summary?.power_consumption,
      avgFanSpeed: summary?.cooling.fan_duty,
    };

    if (perfSummary?.current_preset?.pretty) {
      response.currentPreset = perfSummary.current_preset.pretty
        .split('~')[1]
        .trim();
    }

    return response;
  }

  private calcStateTime(time = 0): AsicSummaryResponseDto['status'] {
    const start = Date.now() - time * 1000;
    const res = Date.now();

    const diff = res - start;

    const days = Math.floor(diff / DateMilliseconds.DAY);
    const hours = Math.floor((diff / DateMilliseconds.HOUR) % 24);
    const minutes = Math.floor((diff / DateMilliseconds.MINUTE) % 60);

    return {
      stateTimeDays: days,
      stateTimeHours: hours,
      stateTimeMinutes: minutes,
    };
  }
}
