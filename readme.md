to start server: npm start

migrations:
npx knex migrate:latest
npx knex migrate:rollback
NODE_ENV=testing npx knex migrate:latest

create migration:
knex migrate:make migration_create_table

minio run:
minio server '/Users/silchenko/server-data' --console-address ":9001"

