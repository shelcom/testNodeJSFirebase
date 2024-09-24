import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('Tokens', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('refreshToken');
    table.string('forgotPasswordToken');
    table.uuid('userId').notNullable();

    table
      .foreign('userId')
      .references('id')
      .inTable('Users')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('Tokens');
}
