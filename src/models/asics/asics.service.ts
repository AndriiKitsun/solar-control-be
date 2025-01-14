import { Injectable } from '@nestjs/common';
import { CreateAsicDto, UpdateAsicDto } from './dto';
import { AsicsRepository } from './asics.repository';
import { AsicsApiService } from '@api/modules';
import { Asic } from './entities';

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
      token: auth.token,
      hostname: info.system?.network_status.hostname,
    };

    return this.asicsRepository.create(payload);
  }

  findAll(): Promise<Asic[]> {
    return this.asicsRepository.findAll();
  }

  findOne(id: string): Promise<Asic> {
    return this.asicsRepository.findOne(id);
  }

  update(id: string, updateAsicDto: UpdateAsicDto): Promise<Asic> {
    return this.asicsRepository.update(id, updateAsicDto);
  }

  remove(id: string): Promise<void> {
    return this.asicsRepository.remove(id);
  }

  async start(id: string, token: string): Promise<void> {
    const asic = await this.asicsRepository.findOne(id);

    return this.asicsApiService.start(asic.ip, token);
  }

  async stop(id: string, token: string): Promise<void> {
    const asic = await this.asicsRepository.findOne(id);

    return this.asicsApiService.stop(asic.ip, token);
  }
}
