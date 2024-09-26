import {Knex} from 'knex';
import {OrderStatus} from '../src/models/orderStatus';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('Orders', function (table) {
    table.string('status').defaultTo(OrderStatus.waitingForPayment);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('Orders', function (table) {
    table.dropColumn('status');
  });
}
