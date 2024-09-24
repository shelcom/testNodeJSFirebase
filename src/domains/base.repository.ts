import {Knex} from 'knex';
import {Model} from 'objection';
import {DatabaseSource} from '@infrastructure/database/data-source';

export interface JoinModel {
  joinParams: {
    table: string;
    joinedColumn: string;
    column: string;
  };
  selectParams?: string[];
  whereParams?: Record<string, any>;
}

export interface WhereInModel {
  key: string;
  values: any[];
}

export interface GetAllModel {
  offset?: number;
  limit?: number;
  whereModel?: Record<string, any>;
  whereParams?: {
    name: string;
    conditionMark: string;
    value: any;
  };
  whereNotModel?: Record<string, any>;
  orWhereModel?: Record<string, any>;
  graphFetched?: string;
}

export interface GetAllWithPaginationModel {
  page: number;
  perPage: number;
  whereModel?: Record<string, any>;
  whereNotModel?: Record<string, any>;
  orWhereModel?: Record<string, any>;
  graphFetched?: string;
}

export default class BaseRepository<T extends Model> {
  protected model: typeof Model;
  protected knexInstance: object;

  constructor(model: typeof Model) {
    this.model = model;
    const dbSource = new DatabaseSource();
    this.knexInstance = dbSource.getKnex();
  }

  create = async (object: Record<string, any>): Promise<T> => {
    return (await this.model
      .query(this.knexInstance)
      .insert(object)) as unknown as T;
  };

  findOneByCondition = async (
    condition: Record<string, any>,
    selectFields: string[] = [],
  ): Promise<T | null> => {
    const query = this.model.query(this.knexInstance);
    if (selectFields.length) {
      query.select(selectFields);
    }

    const result = await query.findOne(condition);
    return result as T;
  };

  getAll = async (model: GetAllModel): Promise<T[]> => {
    const query = this.model.query(this.knexInstance);

    if (model.whereModel) query.where(model.whereModel);
    if (model.whereParams)
      query.where(
        model.whereParams.name,
        model.whereParams.conditionMark,
        model.whereParams.value,
      );
    if (model.whereNotModel) query.whereNot(model.whereNotModel);
    if (model.orWhereModel) query.orWhere(model.orWhereModel);
    if (model.offset) query.offset(model.offset);
    if (model.limit) query.limit(model.limit);
    if (model.graphFetched) query.withGraphFetched(model.graphFetched);

    return (await query) as T[];
  };

  getCount = async (
    whereModel: Record<string, any> = null,
  ): Promise<number> => {
    const query = this.model.query(this.knexInstance).count('* as count');
    if (whereModel) {
      query.where(whereModel);
    }

    const result = await query.first();
    const countResult = result as unknown as {count: string};
    return countResult ? parseInt(countResult.count, 10) : 0;
  };

  valuesExistIn = async (
    whereInModel: WhereInModel,
    andWhereModel: Record<string, any>,
  ): Promise<boolean> => {
    const countResult = await this.model
      .query(this.knexInstance)
      .count('* as count')
      .whereIn(whereInModel.key, whereInModel.values)
      .andWhere(andWhereModel)
      .first();

    const countModel = countResult[0] as {count: string};
    return Number(countModel.count) === whereInModel.values.length;
  };

  update = async (model: Record<string, any>): Promise<number> => {
    const {id, ...updateData} = model;
    return await this.model
      .query(this.knexInstance)
      .patch(updateData)
      .where('id', id);
  };

  deleteWhere = async (name: string, param: any): Promise<number> => {
    return await this.model
      .query(this.knexInstance)
      .where(name, param)
      .delete();
  };

  delete = async (id: any): Promise<number> => {
    return await this.model.query(this.knexInstance).where('id', id).delete();
  };

  getAllWithPagination = async (
    model: GetAllWithPaginationModel,
  ): Promise<{data: T[]; totalCount: number}> => {
    const data = await this.getAll({
      offset: (model.page - 1) * model.perPage,
      limit: model.perPage,
      ...model,
    });
    const totalCount = await this.getCount(model.whereModel);
    return {data, totalCount};
  };

  join = async (model: JoinModel): Promise<T[]> => {
    let query = this.knexInstance(this.model.tableName).join(
      model.joinParams.table,
      model.joinParams.joinedColumn,
      model.joinParams.column,
    );

    if (model.selectParams) {
      query = query.select(...model.selectParams);
    }

    if (model.whereParams) {
      query = query.where(model.whereParams);
    }

    const result = await query;
    return result as T[];
  };
}
