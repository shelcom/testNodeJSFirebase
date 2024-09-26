import {PaginationBodyModel} from 'models/paginationBodyModel';

export default class BaseController {
  paginationBody = (model: PaginationBodyModel) => {
    return {
      data: model.data.data,
      metadata: {
        page: model.page,
        per_page: model.perPage,
        total_count: model.data.totalCount,
        total_page: Math.ceil(model.data.totalCount / model.perPage),
      },
    };
  };
}
