import knex from 'knex';
import {LoggerService} from '@common/logger/logger.service';
import knexConfig from '@infrastructure/database/knex.config';

const environment = 'test';
const config = knexConfig[environment];
const db = knex(config);
const logger = new LoggerService();

export async function getExistingTables() {
  try {
    const result = await db.raw(`
      SELECT table_name FROM information_schema.tables WHERE table_schema='public';
    `);
    const existingTables = result[0].map(row => row.name);
    logger.log('Existing tables:', existingTables);
    return existingTables;
  } catch (error) {
    logger.error('Error retrieving tables:', error);
    throw error;
  }
}
