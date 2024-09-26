import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('PushNotifications', (table) => {
    table.increments('id').primary();
    table.string('onesignal_id');
    table.string('device_id');
    table.string('device_type');
    table
      .integer('user_id')
      .references('id')
      .inTable('Users')
      .onDelete('CASCADE');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('PushNotifications');
}
