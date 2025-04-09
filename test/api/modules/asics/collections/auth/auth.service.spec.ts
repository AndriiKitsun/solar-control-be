import { Test } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { HttpServiceMock } from '../../../../services/mocks/http-service.mock';
import { AsicsAuthApiService, AsicUnlockScreenBody } from '@api/modules/asics';
import { AsicsHttpBaseApiServiceMock } from '../../services/mocks/http-base.service.mock';
import { AsicsAuthApiServiceMock } from './mocks/auth.service.mock';

describe('AsicsAuthApiService', () => {
  let service: AsicsAuthApiService;

  let postSpy: jest.SpyInstance;
  let buildUrlSpy: jest.SpyInstance;

  const { urlMock, responseDataMock } = HttpServiceMock;
  const { ipMock } = AsicsHttpBaseApiServiceMock;
  const { passwordMock } = AsicsAuthApiServiceMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AsicsAuthApiService,
        {
          provide: HttpService,
          useClass: HttpServiceMock,
        },
      ],
    }).compile();

    service = module.get(AsicsAuthApiService);

    buildUrlSpy = jest
      .spyOn(service as any, 'buildUrl')
      .mockReturnValueOnce(urlMock);
    postSpy = jest
      .spyOn(service as any, 'post')
      .mockResolvedValue(responseDataMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return login response', async () => {
      const expectedBody: AsicUnlockScreenBody = {
        pw: passwordMock,
      };

      const result = await service.login(ipMock, passwordMock);

      expect(buildUrlSpy).toHaveBeenCalledWith(ipMock, 'unlock');
      expect(postSpy).toHaveBeenCalledWith(urlMock, expectedBody);

      expect(result).toBe(responseDataMock);
    });
  });
});
