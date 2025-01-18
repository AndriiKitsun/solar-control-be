import { Injectable } from '@nestjs/common';
import { CreateAsicDto, UpdateAsicDto, AsicSummaryResponseDto } from './dto';
import { AsicsRepository } from './asics.repository';
import { AsicsApiService } from '@api/modules';
import { Asic } from './entities';
import { encrypt } from '@common/utils';

@Injectable()
export class AsicsService {
  constructor(
    private readonly asicsRepository: AsicsRepository,
    private readonly asicsApiService: AsicsApiService,
  ) {}

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
    return this.asicsRepository.update(id, updateAsicDto);
  }

  remove(id: string): Promise<void> {
    return this.asicsRepository.remove(id);
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
      state: summary?.miner_status.miner_state,
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
}
