import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('Payments', (table) => {
    table.increments('id').primary();
    table.string('payment_intent_id');
    table.integer('price');
    table
      .integer('order_id')
      .references('id')
      .inTable('Orders')
      .onDelete('CASCADE');
    table.string('status');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('Payments');
}
