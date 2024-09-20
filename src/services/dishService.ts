import ApiError from 'errors/ApiError';
import strings from 'strings';
import {injectable} from 'tsyringe';
import DishRepository from 'repositories/dishRepository';
import {DishType} from 'models/dishType';
import RestaurantRepository from 'repositories/restaurantRepository';
import ImageService from './imageService';

export interface DishCreateModel {
  restaurantId: number;
  name: string;
  description: string;
  images: string[];
  price: number;
  type: DishType;
}

export interface DishUpdateModel {
  id: number;
  name?: string;
  description?: string;
  images?: string[];
  price?: number;
  type?: DishType;
}

@injectable()
class DishService {
  constructor(
    private restaurantRepository: RestaurantRepository,
    private dishRepository: DishRepository,
    private imageService: ImageService,
  ) {}

  create = async (model: DishCreateModel, currentUserId: number) => {
    const foundedDish = await this.dishRepository.findOneByCondition({
      name: model.name,
    });

    if (foundedDish) {
      throw ApiError.unprocessableEntity(strings.dish.dishAlreadyExist);
    }

    const restaurant = await this.restaurantRepository.findOneByCondition({
      id: model.restaurantId,
    });

    if (!restaurant) {
      throw ApiError.notFound(strings.restaurant.restaurantNotFound);
    }

    if (restaurant.owner_id != currentUserId) {
      throw ApiError.forbidden();
    }

    const dish = await this.dishRepository.create({
      name: model.name,
      description: model.description,
      images: model.images,
      restaurant_id: model.restaurantId,
      price: model.price,
      type: model.type,
    });

    return dish;
  };

  update = async (model: DishUpdateModel, currentUserId: number) => {
    const dish = await this.dishRepository.joinRestaurantsToGetOwnerId(
      model.id,
    );

    if (dish.owner_id != currentUserId) {
      throw ApiError.forbidden();
    }

    if (!dish) {
      throw ApiError.notFound(strings.dish.dishNotFound);
    }

    if (model.name) {
      const newNameRestaurant = await this.dishRepository.findOneByCondition({
        name: model.name,
      });

      if (newNameRestaurant && newNameRestaurant.id != model.id) {
        throw ApiError.unprocessableEntity(strings.dish.dishAlreadyExist);
      }

      dish.name = model.name;
    }

    if (model.description) {
      dish.description = model.description;
    }

    if (model.price) {
      dish.price = model.price;
    }

    if (model.type) {
      dish.type = model.type;
    }

    if (model.images) {
      await this.imageService.replaceImages(dish.images, model.images);

      dish.images = model.images;
    }

    delete dish.owner_id;
    this.dishRepository.update(dish);

    return dish;
  };

  getOne = async (id: number) => {
    const dish = await this.dishRepository.findOneByCondition({id});
    if (!dish) {
      throw ApiError.notFound(strings.dish.dishNotFound);
    }

    return dish;
  };

  getFullPrice = async (ids: number[]) => {
    const prices = await this.dishRepository.getPrices(ids);
    let fullPrice = 0;
    prices.forEach((item) => {
      fullPrice += item.price;
    });

    return fullPrice;
  };

  getAllForRestaurant = async (
    page: number,
    perPage: number,
    restaurantId: number,
  ) => {
    const whereModel = {restaurant_id: restaurantId};
    const data = await this.dishRepository.getAllWithPagination({
      page,
      perPage,
      whereModel,
    });
    return data;
  };
}

export default DishService;
