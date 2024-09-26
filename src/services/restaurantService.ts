import ApiError from 'errors/ApiError';
import strings from 'strings';
import {injectable} from 'tsyringe';
import RestaurantRepository from 'repositories/restaurantRepository';
import {Location} from 'models/location';
import ImageService from './imageService';
import PushNotificationService from './pushNotificationService';
import {IUser, UserRole} from 'models/database/user';

export interface RestaurantCreateModel {
  ownerId: number;
  name: string;
  description: string;
  images: string[];
  location: Location;
}

export interface RestaurantUpdateModel {
  id: number;
  name?: string;
  description?: string;
  images?: string[];
  location?: Location;
}

@injectable()
class RestaurantService {
  constructor(
    private restaurantRepository: RestaurantRepository,
    private imageService: ImageService,
    private pushNotificationService: PushNotificationService,
  ) {}

  create = async (model: RestaurantCreateModel) => {
    const foundedRestaurant =
      await this.restaurantRepository.findOneByCondition({name: model.name});

    if (foundedRestaurant) {
      throw ApiError.unprocessableEntity(
        strings.restaurant.restaurantAlreadyExist,
      );
    }

    const restaurant = await this.restaurantRepository.create({
      name: model.name,
      description: model.description,
      images: model.images,
      owner_id: model.ownerId,
      location: model.location,
    });

    await this.pushNotificationService.sendPushToGroup({
      text: strings.notification.newRestaurantsAreAvailableNow,
      userRole: UserRole.user,
    });

    return restaurant;
  };

  update = async (model: RestaurantUpdateModel, currentUserId: number) => {
    const restaurant = await this.restaurantRepository.findOneByCondition({
      id: model.id,
    });

    if (restaurant.owner_id != currentUserId) {
      throw ApiError.forbidden();
    }

    if (!restaurant) {
      throw ApiError.notFound(strings.restaurant.restaurantNotFound);
    }

    if (model.name) {
      const newNameRestaurant =
        await this.restaurantRepository.findOneByCondition({
          name: model.name,
        });

      if (newNameRestaurant) {
        throw ApiError.unprocessableEntity(
          strings.restaurant.restaurantAlreadyExist,
        );
      }

      restaurant.name = model.name;
    }

    if (model.description) {
      restaurant.description = model.description;
    }

    if (model.location) {
      restaurant.location = model.location;
    }

    if (model.images) {
      await this.imageService.replaceImages(restaurant.images, model.images);

      restaurant.images = model.images;
    }

    this.restaurantRepository.update(restaurant);

    return restaurant;
  };

  getAll = async (page: number, perPage: number, user: IUser) => {
    const whereModel = {} as any;    
    if (user.role === UserRole.serviceProvider) {
      whereModel.owner_id = user.id;
    }

    const data = await this.restaurantRepository.getAllWithPagination({
      page,
      perPage,
      whereModel,
    });

    return data;
  };

  getOne = async (id: number) => {
    const restaurant = await this.restaurantRepository.findOneByCondition({id});
    if (!restaurant) {
      throw ApiError.notFound(strings.restaurant.restaurantNotFound);
    }

    return restaurant;
  };

  delete = async (id: number, currentUserId: number) => {
    // const restaurant = await this.restaurantRepository.findOneByCondition({id});
    // if (!restaurant) {
    //   throw ApiError.notFound(strings.restaurant.restaurantNotFound);
    // }
    // if (restaurant.owner_id != currentUserId) {
    //   throw ApiError.forbidden();
    // }
    // await this.restaurantRepository.delete(restaurant);
  };
}

export default RestaurantService;
