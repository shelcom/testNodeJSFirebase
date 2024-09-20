import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('Images', function (table) {
    table.string('500x500');
    table.string('100x100');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('Images', function (table) {
    table.dropColumn('500x500');
    table.dropColumn('100x100');
  });
}
