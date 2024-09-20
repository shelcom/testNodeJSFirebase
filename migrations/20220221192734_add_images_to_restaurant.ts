import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('Restaurants', function (table) {
    table.specificType('images', 'text[]');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('Restaurants', function (table) {
    table.dropColumn('images');
  });
}
