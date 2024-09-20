import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('Images', function (table) {
    table.renameColumn('500x500', 'size_500_x_500');
    table.renameColumn('100x100', 'size_100_x_100');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('Images', function (table) {
    table.renameColumn('size_500_x_500', '500x500');
    table.renameColumn('size_100_x_100', '100x100');
  });
}
