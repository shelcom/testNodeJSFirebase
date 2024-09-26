import {Knex} from 'knex';
import {RegistrationType} from '../src/models/database/user';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('Users', function (table) {
    table.string('challenge', 512);
    table.string('registration_type').defaultTo(RegistrationType.password);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('Users', function (table) {
    table.dropColumn('registration_type');
    table.dropColumn('challenge');
  });
}

