import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('Tokens', function (table) {
    table.string('refresh_token', 1024).alter()
  }).alterTable('Users', function (table) {
    table.string('password', 1024).alter()
    table.string('forget_password_token', 1024).alter()
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('Tokens', function (table) {
    table.string('refresh_token', 255).alter()
  }).alterTable('Users', function (table) {
    table.string('password', 255).alter()
    table.string('forget_password_token', 255).alter()
  });
}

