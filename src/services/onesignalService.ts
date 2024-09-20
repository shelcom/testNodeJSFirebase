import ApiError from 'errors/ApiError';
import strings from 'strings';
import {injectable} from 'tsyringe';
import * as OneSignal from 'onesignal-node';
import {DevicePlatform} from 'models/devicePlatform';
import {UserRole} from 'models/database/user';
import {
  OnesignalSendNotificationModel,
  SendNotificationModelIdentifier,
} from 'models/sendNotificationModel';
import {CreateNotificationBody} from 'onesignal-node/lib/types';

@injectable()
class OnesignalService {
  private client = new OneSignal.Client(
    process.env.APP_ID_ONESIGNAL,
    process.env.API_KEY_ONESIGNAL,
  );

  addDevice = async (
    identifier: string,
    deviceType: DevicePlatform,
    userRole: string,
  ) => {
    const response = await this.client.addDevice({
      identifier,
      device_type: 0,
      external_user_id: userRole,
    });

    return response.body.id;
  };

  editDevice = async (
    id: string,
    identifier: string,
    deviceType: DevicePlatform,
  ) => {
    const response = await this.client.editDevice(id, {identifier});
    return response.body.id;
  };

  sendNotification = async (model: OnesignalSendNotificationModel) => {
    const notificationModel: CreateNotificationBody = {
      contents: {
        en: model.text,
      },
    };

    switch (model.type) {
      case 'identifier':
        notificationModel.include_ios_tokens = [model.identifier];
        break;
      case 'group':
        notificationModel.include_external_user_ids = [model.group];
        break;
    }

    const notification = await this.client.createNotification(
      notificationModel,
    );

    console.log(notification.body);
  };
}

export default OnesignalService;
