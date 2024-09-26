import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('Dishes', function (table) {
    table.dropForeign('restaurant_id');
    table
      .foreign('restaurant_id')
      .references('id')
      .inTable('Restaurants')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('Dishes', function (table) {
    table.dropForeign('restaurant_id');
    table.foreign('restaurant_id').references('id').inTable('Restaurants');
  });
}
