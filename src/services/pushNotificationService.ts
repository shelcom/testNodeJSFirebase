import ApiError from 'errors/ApiError';
import {IUser} from 'models/database/user';
import {DevicePlatform} from 'models/devicePlatform';
import {
  SendNotificationModelUserId,
  SendNotificationModelUserRole,
} from 'models/sendNotificationModel';
import PushNotificationRepository from 'repositories/pushNotificationRepository';
import strings from 'strings';
import {injectable} from 'tsyringe';
import OnesignalService from './onesignalService';

@injectable()
class PushNotificationService {
  constructor(
    private onesignalService: OnesignalService,
    private pushNotificationRepository: PushNotificationRepository,
  ) {}

  register = async (
    identifier: string,
    platform: DevicePlatform,
    user: IUser,
  ) => {
    const pushNotification =
      await this.pushNotificationRepository.findOneByCondition({
        user_id: user.id,
      });

    if (!pushNotification) {
      const onesignalId = await this.onesignalService.addDevice(
        identifier,
        platform,
        user.role,
      );

      await this.pushNotificationRepository.create({
        onesignal_id: onesignalId,
        device_id: identifier,
        device_type: platform,
        user_id: user.id,
      });
    } else {
      await this.onesignalService.editDevice(
        pushNotification.onesignal_id,
        identifier,
        platform,
      );

      pushNotification.device_id = identifier;
      pushNotification.device_type = platform;
      await this.pushNotificationRepository.update(pushNotification);
    }
  };

  sendPushToGroup = async (model: SendNotificationModelUserRole) => {
    await this.onesignalService.sendNotification({
      type: 'group',
      group: model.userRole,
      text: model.text,
    });
  };

  sendPushToUser = async (model: SendNotificationModelUserId) => {
    const pushNotification =
      await this.pushNotificationRepository.findOneByCondition({
        user_id: model.userId,
      });

    if (pushNotification) {
      await this.onesignalService.sendNotification({
        type: 'identifier',
        identifier: pushNotification.device_id,
        text: model.text,
      });
    }
  };
}

export default PushNotificationService;
