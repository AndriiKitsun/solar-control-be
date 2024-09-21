import { Test, TestingModule } from '@nestjs/testing';
import { PzemsCalculationService } from './pzems-calculation.service';
import { PzemsRepository } from '../pzems.repository';

describe('PzemsCalculationService', () => {
  let service: PzemsCalculationService;

  const pzemsRepositoryMock = (): Partial<PzemsRepository> => ({
    findRecentForCalc: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PzemsCalculationService,
        {
          provide: PzemsRepository,
          useFactory: pzemsRepositoryMock,
        },
      ],
    }).compile();

    service = module.get(PzemsCalculationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
