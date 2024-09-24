import {Injectable, LoggerService as NestLoggerService} from '@nestjs/common';
import {
  createLogger,
  format,
  transports,
  Logger as WinstonLogger,
} from 'winston';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: WinstonLogger;

  constructor() {
    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.printf(({timestamp, level, message}) => {
          return `${timestamp} [${level}]: ${message}`;
        }),
      ),
      transports: [new transports.Console()],
    });
  }

  log(message?: string, ...optionalParams: any[]) {
    if (!message && optionalParams.length > 0) {
      message = optionalParams
        .map(param =>
          typeof param === 'object' ? JSON.stringify(param) : param,
        )
        .join(' ');
    } else if (optionalParams.length > 0) {
      const formattedParams = optionalParams
        .map(param =>
          typeof param === 'object' ? JSON.stringify(param) : param,
        )
        .join(' ');
      message = `${message} ${formattedParams}`;
    }

    this.logger.info(message || '');
  }

  error(message: string, trace: string | object) {
    this.logger.error(`${message} - ${trace}`);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }
}
