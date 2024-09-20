import {Knex} from 'knex';
import {DishType} from '../src/models/dishType';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('Dishes', (table) => {
    table.increments('id').primary();
    table.string('name');
    table.string('description');
    table.integer('price');
    table.specificType('images', 'text[]');
    table.integer('restaurant_id').references('id').inTable('Restaurants');
    table.string('type').defaultTo(DishType.regular);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('Dishes');
}
