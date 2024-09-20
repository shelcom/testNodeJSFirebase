import 'dotenv/config';

const useSSL = process.env.DB_SSL === 'true';

export default {
  client: 'postgresql',
  connection: {
    connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    ssl: useSSL ? {rejectUnauthorized: false} : false,
  },
};
