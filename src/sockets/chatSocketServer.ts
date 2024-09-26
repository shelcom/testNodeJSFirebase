import {Socket} from 'socket.io';
import {injectable} from 'tsyringe';
import {CommonEventType, OnEventType} from './eventType';
import strings from 'strings';
import {
  MessageCreateModel,
  MessageDeleteModel,
  MessageEditModel,
  ChatSubscribe,
  ChatUnsubscribe,
} from './interfaces/messageModels';
import MessageService from 'services/messageService';
import joiValidation from 'constants/joiValidation';
import {BaseSocketServer} from './baseSocketServer';

@injectable()
export class ChatSocketServer extends BaseSocketServer {
  constructor(private messageService: MessageService) {
    super();
  }

  protected roomName = (chatId: number) => {
    return `chat_${chatId}`;
  };

  configure = (socket: Socket) => {
    this.socket = socket;

    socket.on(OnEventType.chatSubscribe, this.chatSubscribe);
    socket.on(OnEventType.chatUnsubscribe, this.chatUnsubscribe);
    socket.on(CommonEventType.messageCreate, this.messageCreate);
    socket.on(CommonEventType.messageEdit, this.messageEdit);
    socket.on(CommonEventType.messageDelete, this.messageDelete);
  };

  private chatSubscribe = (data: ChatSubscribe) => {
    this.validate({chat_id: joiValidation.id}, data)
      .then(() => {
        this.socket.join(this.roomName(data.chat_id));
        this.inform(strings.chatSocket.successfullyJoinedChat);
      })
      .catch((e) => {
        this.error(e);
      });
  };

  private chatUnsubscribe = (data: ChatUnsubscribe) => {
    this.validate({chat_id: joiValidation.id}, data)
      .then(() => {
        this.socket.leave(this.roomName(data.chat_id));
        this.inform(strings.chatSocket.successfullyLeavedChat);
      })
      .catch((e) => {
        this.error(e);
      });
  };

  private messageCreate = async (data: MessageCreateModel) => {
    this.validate(
      {
        message: joiValidation.requiredString,
        date: joiValidation.optionalDate.required(),
        chat_id: joiValidation.id,
      },
      data,
    )
      .then(async () => {
        const message = await this.messageService.create({
          message: data.message,
          date: data.date,
          ownerId: this.socket.data.user.id,
          chatId: data.chat_id,
        });

        this.emitToRoom(data.chat_id, CommonEventType.messageCreate, message);
      })
      .catch((e) => {
        this.error(e);
      });
  };

  private messageEdit = (data: MessageEditModel) => {
    this.validate(
      {
        id: joiValidation.id,
        message: joiValidation.requiredString,
      },
      data,
    )
      .then(async () => {
        const message = await this.messageService.edit(
          {
            id: data.id,
            message: data.message,
          },
          this.socket.data.user.id,
        );

        this.emitToRoom(data.id, CommonEventType.messageEdit, message);
      })
      .catch((e) => {
        this.error(e);
      });
  };

  private messageDelete = async (data: MessageDeleteModel) => {
    this.validate(
      {
        id: joiValidation.id,
      },
      data,
    )
      .then(async () => {
        await this.messageService.delete(data.id, this.socket.data.user.id);
        this.emitToRoom(data.id, CommonEventType.messageDelete, {});
      })
      .catch((e) => {
        this.error(e);
      });
  };
}
