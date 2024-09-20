import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('Purchases', (table) => {
    table.increments('id').primary();
    table.string('receipt', 15000);
    table.string('platform');
    table.string('product_id');
    table.datetime('expiration_date');
    table.string('transaction_id');
    table
      .integer('user_id')
      .references('id')
      .inTable('Users')
      .onDelete('CASCADE');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('Purchases');
}
