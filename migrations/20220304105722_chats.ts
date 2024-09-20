import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('Chats', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.integer('owner_id').references('id').inTable('Users');
      table.integer('user_id').references('id').inTable('Users');
      table.timestamps(true, true);
    })
    .createTable('Messages', (table) => {
      table.increments('id').primary();
      table.string('message');
      table.datetime('date');
      table
        .integer('chat_id')
        .references('id')
        .inTable('Chats')
        .onDelete('CASCADE');
      table.integer('owner_id').references('id').inTable('Users');
      table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('Messages').dropTable('Chats');
}
