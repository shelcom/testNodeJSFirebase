import knex from 'knex';
import {LoggerService} from '../common/logger/logger.service';
import knexConfig from '../infrastructure/database/knex.config';

const environment = 'test'; // Change this to your environment
const config = knexConfig[environment];
const db = knex(config);
let logger: LoggerService = new LoggerService();

async function getExistingTables() {
  try {
    const result = await db.raw(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);
    const existingTables = result.rows
      ? result.rows.map((row: {table_name: any}) => row.table_name)
      : null; // Fallback if rows is undefined

    logger.log('Existing tables:', existingTables);
    return existingTables;
  } catch (error) {
    logger.error('Error retrieving tables:', error);
    throw error;
  }
}

async function dropTables() {
  try {
    const existingTables = await getExistingTables();

    for (const table of existingTables) {
      if (existingTables.includes(table)) {
        try {
          await db.raw(`DROP TABLE IF EXISTS ${table} CASCADE`);
          logger.log(
            `Table ${table} and its dependencies dropped successfully.`,
          );
        } catch (error) {
          logger.error(`Error dropping table ${table}:`, error);
        }
        logger.log(`Table ${table} dropped successfully.`);
      } else {
        logger.log(`Table ${table} does not exist.`);
      }
    }
  } catch (error) {
    logger.error('Error during table operations:', error);
    throw error;
  }
}

dropTables()
  .then(() => process.exit(0))
  .catch(error => {
    logger.error('Error dropping tables:', error);
    process.exit(1);
  });
