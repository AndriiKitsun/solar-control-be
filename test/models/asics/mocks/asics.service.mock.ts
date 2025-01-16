import {
  UpdateAsicDto,
  AsicsService,
  CreateAsicDto,
  Asic,
  AsicSummaryResponseDto,
} from '@models/asics';
import { AsicsRepositoryMock } from './asics.repository.mock';
import { ClassMock } from '@common/types/test.types';

export class AsicsServiceMock implements ClassMock<AsicsService> {
  static readonly asicSummaryResponseDtoMock: AsicSummaryResponseDto = {
    hostname: 'hostname',
    ip: '192.168.55.1',
    state: 'mining',
    avgHashRate: 66.34,
    maxChipTemp: 60,
    powerConsumption: 690,
    avgFanSpeed: 55,
  };

  async create(createAsicDto: CreateAsicDto): Promise<Asic> {
    return AsicsRepositoryMock.asicMock;
  }

  async findAll(): Promise<Asic[]> {
    return Promise.resolve([]);
  }

  async findOne(id: string): Promise<Asic> {
    return AsicsRepositoryMock.asicMock;
  }

  async remove(id: string): Promise<void> {
    return;
  }

  async start(id: string): Promise<void> {
    return;
  }

  async stop(id: string): Promise<void> {
    return;
  }

  async update(id: string, updateAsicDto: UpdateAsicDto): Promise<Asic> {
    return AsicsRepositoryMock.asicMock;
  }

  async getSummary(id: string): Promise<AsicSummaryResponseDto> {
    return AsicsServiceMock.asicSummaryResponseDtoMock;
  }
}
