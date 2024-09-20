import 'dotenv/config';

const useSSL = process.env.DB_SSL === 'true';

export default {
  client: 'postgresql',
  connection: {
    connectionString: `postgres://ylzhmrlf:D-_8VpEi8v2rdmaQxrjwHCNDdXBN2Rle@ziggy.db.elephantsql.com/ylzhmrlf`,
    ssl: useSSL ? {rejectUnauthorized: false} : false,
  },
};
