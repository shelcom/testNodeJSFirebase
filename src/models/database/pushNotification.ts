import {DevicePlatform} from 'models/devicePlatform';
import {Model} from 'objection';

export interface IPushNotification {
  id: number;
  onesignal_id: string;
  device_id: string;
  device_type: DevicePlatform;
  user_id: number;
}

export class PushNotification extends Model implements IPushNotification {
  id: number;
  onesignal_id: string;
  device_id: string;
  device_type: DevicePlatform;
  user_id: number;

  static get tableName() {
    return 'PushNotifications';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['onesignal_id', 'device_id', 'device_type', 'user_id'],

      properties: {
        id: {type: 'integer'},
        onesignal_id: {type: 'string'},
        device_id: {type: 'string'},
        device_type: {type: 'string'},
        user_id: {type: 'integer'},
      },
    };
  }
}
