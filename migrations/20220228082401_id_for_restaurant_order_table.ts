import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('Restaurants_Orders', function (table) {
    table.increments('id').primary();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('Restaurants_Orders', function (table) {
    table.dropColumn('id');
  });
}
