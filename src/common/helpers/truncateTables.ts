import knex from 'knex';
import knexConfig from '@infrastructure/database/knex.config';
import {LoggerService} from '@common/logger/logger.service';

const environment = 'test';
const config = knexConfig[environment];
const db = knex(config);
const logger = new LoggerService();

export async function truncateTables(tables: string[]) {
  jest.clearAllMocks();

  try {
    const tablesList = tables.join(', ');
    await db.raw(`TRUNCATE TABLE ${tablesList} RESTART IDENTITY CASCADE`);
    logger.log(`Tables ${tablesList} truncated successfully.`);
  } catch (error) {
    logger.error('Error truncating tables:', error);
    throw error;
  }
}
