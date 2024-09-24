import type {Knex} from 'knex';
import * as path from 'path';
import 'dotenv/config';

const useSSL = process.env.DB_SSL === 'true';

const knexConfig: {[key: string]: Knex.Config} = {
  development: {
    client: 'pg', // Ensure this client is set
    connection: {
      host: process.env.DB_HOST || "pg-d109371-template-nest-js.c.aivencloud.com",
      port: parseInt(process.env.DB_PORT || "14358", 10),
      user: process.env.DB_USER || "avnadmin",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "defaultdb",
      ssl: useSSL ? {rejectUnauthorized: false} : false,
    },
    // migrations: {
    //   tableName: 'knex_migrations',
    //   directory: path.resolve(__dirname, 'migrations'),
    // },
  },
  test: {
    client: 'pg', // Ensure this client is set
    connection: {
      host: process.env.DB_TEST_HOST || process.env.DB_HOST,
      port:
        parseInt(process.env.DB_TEST_PORT, 10) ||
        parseInt(process.env.DB_PORT, 10),
      user: process.env.DB_TEST_USER || process.env.DB_USER,
      password: process.env.DB_TEST_PASSWORD || process.env.DB_PASSWORD,
      database: process.env.DB_TEST_NAME || process.env.DB_NAME,
      ssl: useSSL ? {rejectUnauthorized: false} : false,
    },
    // migrations: {
    //   tableName: 'knex_migrations',
    //   directory: path.resolve(__dirname, 'migrations'),
    // },
    pool: {
      min: 2,
      max: 10,
      acquireTimeoutMillis: 30000, // Increase acquire timeout
    },
  },
};

export default knexConfig;
