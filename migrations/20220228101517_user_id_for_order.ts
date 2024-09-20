import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('Orders', function (table) {
    table.integer('user_id').references('id').inTable('Users');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('Orders', function (table) {
    table.dropColumn('user_id');
  });
}
