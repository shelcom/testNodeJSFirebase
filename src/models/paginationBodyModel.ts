import {Model} from 'objection';

export interface PaginationBodyModel {
  data: {
    data: Model[];
    totalCount: number;
  };
  page: number;
  perPage: number;
}
