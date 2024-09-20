import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('Users', function (table) {
    table.string('forget_password_token');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('Users', function (table) {
    table.dropColumn('forget_password_token');
  });
}
