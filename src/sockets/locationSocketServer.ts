import joiValidation from 'constants/joiValidation';
import {Socket} from 'socket.io';
import {injectable} from 'tsyringe';
import {BaseSocketServer} from './baseSocketServer';
import {CommonEventType, OnEventType} from './eventType';
import {
  LocationAddModel,
  LocationGetModel,
  OrderSubscribe,
} from './interfaces/locationModels';
import strings from 'strings';
import OrderService from 'services/orderService';
import {UserRole} from 'models/database/user';
import ApiError from 'errors/ApiError';

@injectable()
export class LocationSocketServer extends BaseSocketServer {
  constructor(private orderService: OrderService) {
    super();
  }

  protected roomName = (id: number) => {
    return `location_${id}`;
  };

  configure = (socket: Socket) => {
    this.socket = socket;

    socket.on(OnEventType.orderSubscribe, this.orderSubscribe);
    socket.on(OnEventType.orderUnsubscribe, this.orderUnsubscribe);
    socket.on(CommonEventType.locationAdd, this.locationAdd);
    socket.on(CommonEventType.locationGet, this.locationGet);
  };

  orderSubscribe = (data: OrderSubscribe) => {
    this.validate({order_id: joiValidation.id}, data).then(() => {
      this.socket.join(this.roomName(data.order_id));
      this.inform(strings.locationSocket.subscribedToOrder);
    });
  };

  orderUnsubscribe = (data: OrderSubscribe) => {
    this.validate({order_id: joiValidation.id}, data).then(() => {
      this.socket.join(this.roomName(data.order_id));
      this.inform(strings.locationSocket.unsubscribedToOrder);
    });
  };

  locationAdd = (data: LocationAddModel) => {
    if (this.socket.data.user.role != UserRole.delivery) {
      return this.error(ApiError.forbidden());
    }

    this.validate(
      {
        location: joiValidation.optionalLocation.required(),
        order_id: joiValidation.id,
        time: joiValidation.optionalDate,
      },
      data,
    ).then(async () => {
      await this.orderService.addLocation(
        this.roomName(data.order_id),
        data.location,
        data.time,
      );

      this.emitToRoom(data.order_id, CommonEventType.locationAdd, data);
    });
  };

  locationGet = (data: LocationGetModel) => {
    this.validate(
      {
        order_id: joiValidation.id,
      },
      data,
    ).then(async () => {
      const result = await this.orderService.getAllLocations(
        this.roomName(data.order_id),
      );

      this.emitToRoom(data.order_id, CommonEventType.locationGet, result);
    });
  };
}
