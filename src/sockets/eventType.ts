export enum OnEventType {
  connection = 'connection',
  disconnect = 'disconnect',

  chatSubscribe = 'chat:subscribe',
  chatUnsubscribe = 'chat:unsubscribe',

  orderSubscribe = 'order:subscribe',
  orderUnsubscribe = 'order:unsubscribe',
}

export enum EmitEventType {
  inform = 'inform',
  error = 'error',
}

export enum CommonEventType {
  messageCreate = 'message:create',
  messageEdit = 'message:edit',
  messageDelete = 'message:delete',

  locationAdd = 'location:add',
  locationGet = 'location:get',
}
