import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('Orders', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.string('comment');
      table.string('address');
      table.datetime('delivery_time');
      table.integer('restaurant_id').references('id').inTable('Restaurants');
      table.timestamps(true, true);
    })
    .createTable('Restaurants_Orders', (table) => {
      table.integer('dish_id').unsigned().references('Dishes.id');
      table
        .integer('order_id')
        .unsigned()
        .references('Orders.id')
        .onDelete('CASCADE');
      table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('Orders').dropTable('Restaurants_Orders');
}
