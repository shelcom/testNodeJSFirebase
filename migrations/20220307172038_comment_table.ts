import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('Comments', (table) => {
    table.increments('id').primary();
    table.string('comment');
    table.integer('rating');
    table.integer('restaurant_id').references('id').inTable('Restaurants');
    table.integer('owner_id').references('id').inTable('Users');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('Comments');
}
