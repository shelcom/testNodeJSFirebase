import {Model} from 'objection';
import knex from 'configs/knex';

export interface JoinModel {
  joinParams: {
    table: string;
    joinedColumn: string;
    column: string;
  };
  selectParams?: string[];
  whereParams?: Object;
}

export interface WhereInModel {
  key: string;
  values: string[];
}

export interface GetAllModel {
  offset?: number;
  limit?: number;
  whereModel?: Object;
  whereParams?: {
    name: string;
    conditionMark: string;
    value: any;
  };
  whereNotModel?: Object;
  orWhereModel?: Object;
  graphFetched?: string;
}

export interface GetAllWithPaginationModel {
  page: number;
  perPage: number;
  whereModel?: Object;
  whereNotModel?: Object;
  orWhereModel?: Object;
  graphFetched?: string;
}

export default class BaseRepository<T extends Model> {
  private type: typeof Model;

  constructor(type: typeof Model) {
    this.type = type;
  }

  create = async (object: Object) => {
    return (await this.type.query().insert(object)) as T;
  };

  findOneByCondition = async (
    condition: Object,
    graphFetched: string = null,
  ) => {
    const query = this.type.query();
    if (graphFetched) {
      query.withGraphFetched(graphFetched);
    }

    query.findOne(condition);
    const result = (await query) as unknown as T;
    return result;
  };

  getAll = async (model: GetAllModel) => {
    const condition = this.type.query();
    if (model.graphFetched) {
      condition.withGraphFetched(model.graphFetched);
    }

    condition.select();
    if (model.whereModel) {
      condition.where(model.whereModel);
    }

    if (model.whereParams) {
      condition.where(
        model.whereParams.name,
        model.whereParams.conditionMark,
        model.whereParams.value,
      );
    }

    if (model.whereNotModel) {
      condition.whereNot(model.whereNotModel);
    }

    if (model.orWhereModel) {
      condition.orWhere(model.orWhereModel);
    }

    if (model.offset) {
      condition.offset(model.offset);
    }

    if (model.limit) {
      condition.limit(model.limit);
    }

    return (await condition) as unknown as T[];
  };

  getCount = async (whereModel: Object = null) => {
    const countModel = this.type.query().count();
    if (whereModel) {
      countModel.where(whereModel);
    }

    countModel.first();
    return ((await countModel) as any).count;
  };

  valuesExistIn = async (whereInModel: WhereInModel, andWhereModel: Object) => {
    const countModel = this.type
      .query()
      .count()
      .whereIn(whereInModel.key, whereInModel.values)
      .where(andWhereModel)
      .first();
    return ((await countModel) as any).count == whereInModel.values.length;
  };

  update = async (model: T) => {
    return await model.$query().patch();
  };

  deleteWhere = async (name: string, param: any) => {
    return await this.type.query().delete().where(name, param);
  };

  delete = async (model: T) => {
    return await model.$query().delete();
  };

  getAllWithPagination = async (model: GetAllWithPaginationModel) => {
    const data = await this.getAll({
      offset: (model.page - 1) * model.perPage,
      limit: model.perPage,
      ...model,
    });
    const totalCount = await this.getCount(model.whereModel);
    return {data, totalCount: parseInt(totalCount)};
  };

  join = async (model: JoinModel) => {
    let joinModels = this.type
      .query()
      .join(
        model.joinParams.table,
        model.joinParams.joinedColumn,
        model.joinParams.column,
      );

    if (model.selectParams) {
      joinModels = joinModels.select(...model.selectParams);
    }

    if (model.whereParams) {
      joinModels = joinModels.where(model.whereParams);
    }

    return await joinModels;
  };
}
