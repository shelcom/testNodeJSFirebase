import {Injectable} from '@nestjs/common';
import {Knex} from 'knex';
import knexConfig from './knex.config';
import {environment} from '@common/constants/constants';

@Injectable()
export class DatabaseSource {
  private knex: object;

  constructor() {
    const environment = 'production';
    this.knex = {};
  }

  getKnex(): {} {
    return this.knex;
  }
}
