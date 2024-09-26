import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('User_Passwords', (table) => {
      table.increments('id').primary();
      table.string('password', 1024);
      table.string('forget_password_token', 1024);
      table
        .integer('user_id')
        .references('id')
        .inTable('Users')
        .onDelete('CASCADE');
      table.timestamps(true, true);
    })
    .table('Users', function (table) {
      table.dropColumn('registration_type');
      table.dropColumn('challenge');
      table.dropColumn('forget_password_token');
      table.dropColumn('password');
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable('User_Passwords')
    .table('Users', function (table) {
      table.string('registration_type');
      table.string('challenge', 512);
      table.string('forget_password_token', 1024);
      table.string('password', 1024);
    });
}
