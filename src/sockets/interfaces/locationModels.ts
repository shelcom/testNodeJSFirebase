import {Location} from 'models/location';

export interface OrderSubscribe {
  order_id: number;
}

export interface OrderUnsubscribe {
  order_id: number;
}

export interface LocationAddModel {
  location: Location;
  order_id: number;
  time?: Date;
}

export interface LocationGetModel {
  order_id: number;
}
