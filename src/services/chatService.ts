import ApiError from 'errors/ApiError';
import strings from 'strings';
import {injectable} from 'tsyringe';
import ChatRepository from 'repositories/chatRepository';

export interface ChatCreateModel {
  name: string;
  ownerId: number;
  userId: number;
}

@injectable()
class ChatService {
  constructor(private chatRepository: ChatRepository) {}

  create = async (model: ChatCreateModel) => {
    if (model.ownerId == model.userId) {
      throw ApiError.unprocessableEntity(strings.chat.idsTheSame);
    }

    const chat = await this.chatRepository.create({
      name: model.name,
      owner_id: model.ownerId,
      user_id: model.userId,
    });

    return chat;
  };

  getAll = async (page: number, perPage: number, userId: number) => {
    const chats = await this.chatRepository.getAllWithPagination({
      page,
      perPage,
      whereModel: {
        owner_id: userId,
      },
      orWhereModel: {
        user_id: userId,
      },
    });

    return chats;
  };

  delete = async (chatId: number, userId: number) => {
    const chat = await this.chatRepository.findOneByCondition({id: chatId});
    if (!chat) {
      throw ApiError.notFound(strings.chat.notFound);
    }

    if (!(chat.owner_id == userId || chat.user_id == userId)) {
      throw ApiError.forbidden();
    }

    await this.chatRepository.delete(chat);
  };
}

export default ChatService;
