import ApiError from 'errors/ApiError';
import strings from 'strings';
import {delay, inject, injectable} from 'tsyringe';
import OrderRepository from 'repositories/orderRepository';
import RestaurantOrderRepository from 'repositories/restaurantOrderRepository';
import {OrderStatus} from 'models/orderStatus';
import {OrderGraphFetched} from 'models/database/order';
import StorageManager from 'storage/storageManager';
import {Location} from 'models/location';
import PaymentService from './paymentService';
import {IUser, UserRole} from 'models/database/user';
import DishService from './dishService';
import PushNotificationService from './pushNotificationService';

export interface OrderModel {
  restaurantId: number;
  name: string;
  comment: string;
  dishIds: number[];
  address: string;
  deliveryTime?: Date;
}

export interface LocationGetModel {
  location: Location;
  time: Date;
}

@injectable()
class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private restaurantOrderRepository: RestaurantOrderRepository,
    private storageManager: StorageManager,
    @inject(delay(() => PaymentService)) private paymentService: PaymentService,
    private dishService: DishService,
    private pushNotificationService: PushNotificationService,
  ) {}

  create = async (model: OrderModel, user: IUser) => {
    const order = await this.orderRepository.create({
      restaurant_id: model.restaurantId,
      name: model.name,
      comment: model.comment,
      address: model.address,
      delivery_time: model.deliveryTime.toISOString(),
      user_id: user.id,
    });

    for (let index = 0; index < model.dishIds.length; index++) {
      const element = model.dishIds[index];
      await this.restaurantOrderRepository.create({
        dish_id: element,
        order_id: order.id,
      });
    }

    const price = await this.dishService.getFullPrice(model.dishIds);
    const payment = await this.paymentService.createPayment(
      user,
      order.id,
      price,
    );

    return {order: {...order, dish_ids: model.dishIds}, payment};
  };

  delete = async (id: number, userId: number) => {
    const order = await this.orderRepository.findOneByCondition({id});
    if (!order) {
      throw ApiError.notFound(strings.order.orderNotFound);
    }

    if (order.user_id != userId) {
      throw ApiError.forbidden();
    }

    await this.orderRepository.delete(order);
  };

  getAllForRestaurant = async (
    page: number,
    perPage: number,
    restaurantId: number,
    userId: number = null,
  ) => {
    const whereModel = {restaurant_id: restaurantId} as any;
    if (userId) {
      whereModel.user_id = userId;
    }

    const data = await this.orderRepository.getAllWithPagination({
      page,
      perPage,
      whereModel,
      graphFetched: OrderGraphFetched.dishes,
    });

    return data;
  };

  getAll = async (page: number, perPage: number, userId: number = null) => {
    const whereModel = {} as any;
    if (userId) {
      whereModel.user_id = userId;
    }

    const data = await this.orderRepository.getAllWithPagination({
      page,
      perPage,
      whereModel,
      graphFetched: OrderGraphFetched.dishes,
    });

    return data;
  };

  changeStatus = async (id: number, status: OrderStatus) => {
    const order = await this.orderRepository.findOneByCondition(
      {id},
      OrderGraphFetched.dishes,
    );
    if (!order) {
      throw ApiError.notFound(strings.order.orderNotFound);
    }

    order.status = status;
    await this.orderRepository.update(order);
    return order;
  };

  addLocation = async (key: string, location: Location, time?: Date) => {
    const locationString = `latitude=${location.latitude};longitude=${location.longitude}`;
    await this.storageManager.set(
      key,
      (time || new Date()).getTime().toString(),
      locationString,
    );
  };

  getAllLocations = async (key: string) => {
    const object = await this.storageManager.get(key);
    let locationGetModels: LocationGetModel[] = [];

    for (const [time, value] of Object.entries(object)) {
      const splitedLocationString = value.split(';');
      locationGetModels.push({
        time: new Date(parseInt(time)),
        location: {
          latitude: splitedLocationString[0].split('=')[1],
          longitude: splitedLocationString[1].split('=')[1],
        },
      });
    }

    return locationGetModels;
  };

  changeStatusAfterPayment = async (id: number) => {
    const order = await this.orderRepository.findOneByCondition({id});
    order.status = OrderStatus.new;
    await this.orderRepository.update(order);

    await this.pushNotificationService.sendPushToGroup({
      text: strings.notification.newOrdersAreAvailableNow,
      userRole: UserRole.delivery,
    });
  };
}

export default OrderService;
