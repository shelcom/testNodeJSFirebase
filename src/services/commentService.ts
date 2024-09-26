import ApiError from 'errors/ApiError';
import strings from 'strings';
import {injectable} from 'tsyringe';
import CommentRepository from 'repositories/commentRepository';
import RestaurantRepository from 'repositories/restaurantRepository';

export interface CommentCreateModel {
  comment: string;
  rating: number;
  restaurantId: number;
}

export interface CommentUpdateModel {
  id: number;
  comment?: string;
  rating?: number;
}

@injectable()
class CommentService {
  constructor(
    private commentRepository: CommentRepository,
    private restaurantRepository: RestaurantRepository,
  ) {}

  create = async (model: CommentCreateModel, userId: number) => {
    const restaurant = await this.restaurantRepository.findOneByCondition({
      id: model.restaurantId,
    });

    if (!restaurant) {
      throw ApiError.notFound(strings.restaurant.restaurantNotFound);
    }

    const comment = await this.commentRepository.create({
      comment: model.comment,
      rating: model.rating,
      restaurant_id: model.restaurantId,
      owner_id: userId,
    });

    return comment;
  };

  update = async (model: CommentUpdateModel, userId: number) => {
    const comment = await this.commentRepository.findOneByCondition({
      id: model.id,
    });

    if (!comment) {
      throw ApiError.notFound(strings.comment.notFound);
    }

    if (comment.owner_id != userId) {
      throw ApiError.forbidden();
    }

    if (model.comment) {
      comment.comment = model.comment;
    }

    if (model.rating) {
      comment.rating = model.rating;
    }

    await this.commentRepository.update(comment);

    return comment;
  };

  getAllForRestaurant = async (
    page: number,
    perPage: number,
    restaurantId: number,
  ) => {
    const whereModel = {restaurant_id: restaurantId};
    const data = await this.commentRepository.getAllWithPagination({
      page,
      perPage,
      whereModel,
    });

    return data;
  };
}

export default CommentService;
