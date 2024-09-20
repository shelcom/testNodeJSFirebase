import ApiError from 'errors/ApiError';
import strings from 'strings';
import {injectable} from 'tsyringe';
import MessageRepository from 'repositories/messageRepository';
import ChatRepository from 'repositories/chatRepository';

export interface MessageCreateModel {
  message: string;
  chatId: number;
  date: Date;
  ownerId: number;
}

export interface MessageEditModel {
  id: number;
  message: string;
}

@injectable()
class MessageService {
  constructor(
    private messageRepository: MessageRepository,
    private chatRepository: ChatRepository,
  ) {}

  create = async (model: MessageCreateModel) => {
    const chat = await this.chatRepository.findOneByCondition({
      id: model.chatId,
    });

    if (!chat) {
      throw ApiError.notFound(strings.chat.notFound);
    }

    const message = await this.messageRepository.create({
      message: model.message,
      chat_id: model.chatId,
      date: new Date(model.date).toISOString(),
      owner_id: model.ownerId,
    });

    return message;
  };

  edit = async (model: MessageEditModel, userId: number) => {
    const message = await this.messageRepository.findOneByCondition({
      id: model.id,
    });

    if (!message) {
      throw ApiError.notFound(strings.message.notFound);
    }

    if (message.owner_id != userId) {
      throw ApiError.forbidden();
    }

    message.message = model.message;

    await this.messageRepository.update(message);

    return message;
  };

  delete = async (messageId: number, userId: number) => {
    const message = await this.messageRepository.findOneByCondition({
      id: messageId,
    });

    if (!message) {
      throw ApiError.notFound(strings.message.notFound);
    }

    if (message.owner_id != userId) {
      throw ApiError.forbidden();
    }

    await this.messageRepository.delete(message);
  };

  getAll = async (
    page: number,
    perPage: number,
    userId: number,
    chatId: number,
  ) => {
    const chat = await this.chatRepository.findOneByCondition({id: chatId});
    if (!chat) {
      throw ApiError.notFound(strings.chat.notFound);
    }

    if (!(chat.owner_id == userId || chat.user_id == userId)) {
      throw ApiError.forbidden();
    }

    const messages = await this.messageRepository.getAllWithPagination({
      page,
      perPage,
      whereModel: {
        chat_id: chatId,
      },
    });

    return messages;
  };
}

export default MessageService;
