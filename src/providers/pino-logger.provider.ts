import { AppConfigType } from '@config/app';
import { Params } from 'nestjs-pino/params';
import pino, {
  stdTimeFunctions,
  TransportTargetOptions,
  LevelWithSilent,
} from 'pino';
import { SerializedRequest, SerializedResponse } from 'pino-std-serializers';
import { NodeEnv } from '@common/enums';
import { PrettyOptions } from 'pino-pretty';

export function PinoLoggerProvider(appConfig: AppConfigType): Params {
  const transports: TransportTargetOptions[] = [];

  if (appConfig.env === NodeEnv.DEVELOPMENT) {
    transports.push({
      target: 'pino-pretty',
      level: 'trace',
      options: {
        colorize: true,
        singleLine: true,
      },
    } satisfies pino.TransportTargetOptions<PrettyOptions>);
  }

  return {
    pinoHttp: {
      level: 'trace',
      timestamp: stdTimeFunctions.isoTime,
      base: null,
      serializers: {
        req: (req: SerializedRequest): Partial<SerializedRequest> => {
          return {
            id: req.id,
            method: req.method,
            url: req.url,
            query: req.query,
            params: req.params,
          };
        },
        res: (res: SerializedResponse): Partial<SerializedResponse> => {
          return {
            statusCode: res.statusCode,
          };
        },
      },
      transport: {
        targets: [
          {
            target: 'pino/file',
            level: appConfig.logLevel,
            options: {
              destination: `./logs/${new Date().toJSON().split('T')[0]}.log`,
              mkdir: true,
            },
          },
          ...transports,
        ],
      },
      customLogLevel: function (req, res, err?): LevelWithSilent {
        if (res.statusCode >= 400 && res.statusCode < 500) {
          return 'warn';
        } else if (res.statusCode >= 500 || err) {
          return 'error';
        }

        return 'info';
      },
    },
  };
}
