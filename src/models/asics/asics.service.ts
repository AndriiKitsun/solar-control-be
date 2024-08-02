import { Injectable } from '@nestjs/common';
import {
  LoginAsicDto,
  CreateAsicDto,
  AsicResponseDto,
  UpdateAsicDto,
} from './dto';
import { AsicsRepository } from './asics.repository';
import { AsicsApiService, AsicLoginResponse } from '@api/modules';

@Injectable()
export class AsicsService {
  constructor(
    private readonly asicsRepository: AsicsRepository,
    private readonly asicsApiService: AsicsApiService,
  ) {}

  create(createAsicDto: CreateAsicDto): Promise<AsicResponseDto> {
    return this.asicsRepository.create(createAsicDto);
  }

  findAll(): Promise<AsicResponseDto[]> {
    return this.asicsRepository.findAll();
  }

  findOne(id: string): Promise<AsicResponseDto> {
    return this.asicsRepository.findOne(id);
  }

  update(id: string, updateAsicDto: UpdateAsicDto): Promise<AsicResponseDto> {
    return this.asicsRepository.update(id, updateAsicDto);
  }

  remove(id: string): Promise<void> {
    return this.asicsRepository.remove(id);
  }

  async login(
    id: string,
    loginAsicDto: LoginAsicDto,
  ): Promise<AsicLoginResponse> {
    const asic = await this.asicsRepository.findOne(id);

    return this.asicsApiService.login(asic.ip, loginAsicDto.password);
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
