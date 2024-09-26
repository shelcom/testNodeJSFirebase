import {Knex} from 'knex';
import {UserRole} from '../src/models/database/user';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('Users', (table) => {
      table.increments('id').primary();
      table.string('email');
      table.string('password');
      table.string('role').defaultTo(UserRole.user);
      table.timestamps(true, true);
    })
    .createTable('Tokens', (table) => {
      table.increments('id').primary();
      table.string('refresh_token');
      table.integer('userId').references('id').inTable('Users');
      table.timestamps(true, true);
    })
    .createTable('Restaurants', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.string('description');
      table.json('location');
      table.integer('owner_id').references('id').inTable('Users');
      table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable('Tokens')
    .dropTable('Restaurants')
    .dropTable('Users');
}
