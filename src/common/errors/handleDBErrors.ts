import {DatabaseException} from '@common/errors/authExceptions';
import {LoggerService} from '@common/logger/logger.service';

export const handleDatabaseError = (
  logger: LoggerService,
  error: any,
  message?: string,
) => {
  logger.error(message, error);
  throw new DatabaseException(message);
};
