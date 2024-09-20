import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('User_Passkeys', function (table) {
    table.string('credential_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('User_Passkeys', function (table) {
    table.dropColumn('credential_id');
  });
}
