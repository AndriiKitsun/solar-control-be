import { Test } from '@nestjs/testing';
import {
  AsicsApiFacade,
  AsicsAuthApiService,
  AsicsSettingsApiService,
  AsicsAutotuneApiService,
  AsicsMiningApiService,
  AsicsOtherApiService,
} from '@api/modules/asics';
import { AsicsAuthApiServiceMock } from '../collections/auth/mocks/auth.service.mock';
import { AsicsAutotuneApiServiceMock } from '../collections/autotune/mocks/autotune.service.mock';
import { AsicsMiningApiServiceMock } from '../collections/mining/mocks/mining.service.mock';
import { AsicsOtherApiServiceMock } from '../collections/other/mocks/other.service.mock';
import { AsicsSettingsApiServiceMock } from '../collections/settings/mocks/settings.service.mock';
import { AsicsHttpBaseApiServiceMock } from './mocks/http-base.service.mock';

describe('AsicsApiFacade', () => {
  let service: AsicsApiFacade;
  let asicsAuthApiService: AsicsAuthApiService;
  let asicsAutotuneApiService: AsicsAutotuneApiService;
  let asicsMiningApiService: AsicsMiningApiService;
  let asicsOtherApiService: AsicsOtherApiService;
  let asicsSettingsApiService: AsicsSettingsApiService;

  const { ipMock } = AsicsHttpBaseApiServiceMock;
  const { passwordMock, tokenMock } = AsicsAuthApiServiceMock;
  const { asicPresetsMock } = AsicsAutotuneApiServiceMock;
  const { asicStatusMock, asicInfoMock, asicSummaryMock, asicPerfSummaryMock } =
    AsicsOtherApiServiceMock;
  const { asicSettingsMock, asicSettingMock, asicSettingSaveResultMock } =
    AsicsSettingsApiServiceMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AsicsApiFacade,
        {
          provide: AsicsAuthApiService,
          useClass: AsicsAuthApiServiceMock,
        },
        {
          provide: AsicsAutotuneApiService,
          useClass: AsicsAutotuneApiServiceMock,
        },
        {
          provide: AsicsMiningApiService,
          useClass: AsicsMiningApiServiceMock,
        },
        {
          provide: AsicsOtherApiService,
          useClass: AsicsOtherApiServiceMock,
        },
        {
          provide: AsicsSettingsApiService,
          useClass: AsicsSettingsApiServiceMock,
        },
      ],
    }).compile();

    service = module.get(AsicsApiFacade);
    asicsAuthApiService = module.get(AsicsAuthApiService);
    asicsAutotuneApiService = module.get(AsicsAutotuneApiService);
    asicsMiningApiService = module.get(AsicsMiningApiService);
    asicsOtherApiService = module.get(AsicsOtherApiService);
    asicsSettingsApiService = module.get(AsicsSettingsApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return auth token', async () => {
      const loginSpy = jest.spyOn(asicsAuthApiService, 'login');

      const result = await service.login(ipMock, passwordMock);

      expect(loginSpy).toHaveBeenCalledWith(ipMock, passwordMock);

      expect(result).toBe(tokenMock);
    });
  });

  describe('getPresets', () => {
    it('should return presets', async () => {
      const getPresetsSpy = jest.spyOn(asicsAutotuneApiService, 'getPresets');

      const result = await service.getPresets(ipMock, tokenMock);

      expect(getPresetsSpy).toHaveBeenCalledWith(ipMock, tokenMock);

      expect(result).toBe(asicPresetsMock);
    });
  });

  describe('start', () => {
    it('should start asic', async () => {
      const startSpy = jest.spyOn(asicsMiningApiService, 'start');

      const result = await service.start(ipMock, tokenMock);

      expect(startSpy).toHaveBeenCalledWith(ipMock, tokenMock);

      expect(result).toBeUndefined();
    });
  });

  describe('stop', () => {
    it('should stop asic', async () => {
      const stopSpy = jest.spyOn(asicsMiningApiService, 'stop');

      const result = await service.stop(ipMock, tokenMock);

      expect(stopSpy).toHaveBeenCalledWith(ipMock, tokenMock);

      expect(result).toBeUndefined();
    });
  });

  describe('getStatus', () => {
    it('should return asic status', async () => {
      const getStatusSpy = jest.spyOn(asicsOtherApiService, 'getStatus');

      const result = await service.getStatus(ipMock);

      expect(getStatusSpy).toHaveBeenCalledWith(ipMock);

      expect(result).toBe(asicStatusMock);
    });
  });

  describe('getInfo', () => {
    it('should return asic info', async () => {
      const getInfoSpy = jest.spyOn(asicsOtherApiService, 'getInfo');

      const result = await service.getInfo(ipMock);

      expect(getInfoSpy).toHaveBeenCalledWith(ipMock);

      expect(result).toBe(asicInfoMock);
    });
  });

  describe('getSummary', () => {
    it('should return asic summary', async () => {
      const getSummarySpy = jest.spyOn(asicsOtherApiService, 'getSummary');

      const result = await service.getSummary(ipMock);

      expect(getSummarySpy).toHaveBeenCalledWith(ipMock);

      expect(result).toBe(asicSummaryMock);
    });
  });

  describe('getPerfSummary', () => {
    it('should return asic perf summary', async () => {
      const getPerfSummarySpy = jest.spyOn(
        asicsOtherApiService,
        'getPerfSummary',
      );

      const result = await service.getPerfSummary(ipMock);

      expect(getPerfSummarySpy).toHaveBeenCalledWith(ipMock);

      expect(result).toBe(asicPerfSummaryMock);
    });
  });

  describe('getSettings', () => {
    it('should return asic settings', async () => {
      const getSettingsSpy = jest.spyOn(asicsSettingsApiService, 'getSettings');

      const result = await service.getSettings(ipMock, tokenMock);

      expect(getSettingsSpy).toHaveBeenCalledWith(ipMock, tokenMock);

      expect(result).toBe(asicSettingsMock);
    });
  });

  describe('saveSettings', () => {
    it('should return setting save result', async () => {
      const saveSettingsSpy = jest.spyOn(
        asicsSettingsApiService,
        'saveSettings',
      );

      const result = await service.saveSettings(
        ipMock,
        tokenMock,
        asicSettingMock,
      );

      expect(saveSettingsSpy).toHaveBeenCalledWith(
        ipMock,
        tokenMock,
        asicSettingMock,
      );

      expect(result).toBe(asicSettingSaveResultMock);
    });
  });
});
