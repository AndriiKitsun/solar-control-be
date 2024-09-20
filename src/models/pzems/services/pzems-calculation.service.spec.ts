import { Test, TestingModule } from '@nestjs/testing';
import { PzemsCalculationService } from './pzems-calculation.service';
import { PzemsRepository } from '../pzems.repository';
import { CreatePzemDto, PzemDto } from '../dto';

describe('PzemsCalculationService', () => {
  let service: PzemsCalculationService;

  const emptyPzemDtoMock: PzemDto = {
    name: 'acOutput',
  };

  const pzemDtoMock: PzemDto = {
    name: 'acInput',
    voltageV: 220,
  };

  const emptyCreatePzemDtoMock: CreatePzemDto = {
    createdAtGmt: '2024-09-20T09:42:42.233Z',
  };

  const createPzemDtoMock: CreatePzemDto = {
    createdAtGmt: '2024-09-20T09:42:42.233Z',
    pzems: [pzemDtoMock, emptyPzemDtoMock],
  };

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

  describe('getPzemsToCalc', () => {
    it('should return empty array', () => {
      const result = service.getPzemsToCalc(emptyCreatePzemDtoMock.pzems);

      expect(result).toEqual([]);
    });

    it('should return filtered pzems by voltage', () => {
      const result = service.getPzemsToCalc(createPzemDtoMock.pzems);

      expect(result).toEqual([pzemDtoMock]);
    });
  });
});
