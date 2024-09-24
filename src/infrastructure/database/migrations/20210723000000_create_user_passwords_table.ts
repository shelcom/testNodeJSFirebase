import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('UserPasswords', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('password').notNullable();
    table.uuid('userId').notNullable();

    table
      .foreign('userId')
      .references('id')
      .inTable('Users')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('UserPasswords');
}
