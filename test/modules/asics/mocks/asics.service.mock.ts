import {
  AsicSummaryResponseDto,
  CreateAsicDto,
  UpdateAsicDto,
} from '@modules/asics/dto';
import { AsicsService } from '@modules/asics/asics.service';
import { Asic } from '@modules/asics/entities';
import { AsicsRepositoryMock } from './asics.repository.mock';
import { ClassMock } from '@common/types/test.types';
import { LogType } from '@modules/logs/enums';

export class AsicsServiceMock implements ClassMock<AsicsService> {
  static readonly asicSummaryResponseDtoMock: AsicSummaryResponseDto = {
    hostname: 'hostname',
    ip: '192.168.55.1',
    status: {
      state: 'mining',
      stateTimeDays: 0,
      stateTimeHours: 0,
      stateTimeMinutes: 2,
    },
    avgHashRate: 66.34,
    maxChipTemp: 60,
    powerConsumption: 690,
    avgFanSpeed: 55,
    currentPreset: '65 TH',
  };

  async handleStartAsicsCron(): Promise<void> {
    return;
  }

  async handleStopAsicsCron(): Promise<void> {
    return;
  }

  async create(createAsicDto: CreateAsicDto): Promise<Asic> {
    return AsicsRepositoryMock.asicMock;
  }

  async findAll(): Promise<Asic[]> {
    return Promise.resolve([]);
  }

  async findOne(id: string): Promise<Asic> {
    return AsicsRepositoryMock.asicMock;
  }

  async delete(id: string): Promise<void> {
    return;
  }

  async update(id: string, updateAsicDto: UpdateAsicDto): Promise<Asic> {
    return AsicsRepositoryMock.asicMock;
  }

  async getSummary(id: string): Promise<AsicSummaryResponseDto> {
    return AsicsServiceMock.asicSummaryResponseDtoMock;
  }

  calcStateTime(time: number | undefined): AsicSummaryResponseDto['status'] {
    return AsicsServiceMock.asicSummaryResponseDtoMock.status;
  }

  async start(asic: Asic): Promise<void> {
    return;
  }

  startAsics(asics: Asic[], type: LogType): Promise<void>[] {
    return [];
  }

  async stop(asic: Asic): Promise<void> {
    return;
  }

  stopAsics(asics: Asic[], type: LogType): Promise<void>[] {
    return [];
  }
}
