import {PushNotification} from 'models/database/pushNotification';
import {injectable} from 'tsyringe';
import BaseRepository from './baseRepository';

@injectable()
export default class PushNotificationRepository extends BaseRepository<PushNotification> {
  constructor() {
    super(PushNotification);
  }
}
