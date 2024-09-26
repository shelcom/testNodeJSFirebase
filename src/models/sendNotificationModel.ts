import {UserRole} from './database/user';

interface SendNotificationModelBase {
  text: string;
}

export interface SendNotificationModelUserId extends SendNotificationModelBase {
  userId: string;
}

export interface SendNotificationModelUserRole
  extends SendNotificationModelBase {
  userRole: UserRole;
}

export interface SendNotificationModelIdentifier
  extends SendNotificationModelBase {
  type: 'identifier';
  identifier: string;
}

export interface SendNotificationModelGroup extends SendNotificationModelBase {
  type: 'group';
  group: string;
}

export type OnesignalSendNotificationModel =
  | SendNotificationModelIdentifier
  | SendNotificationModelGroup;
