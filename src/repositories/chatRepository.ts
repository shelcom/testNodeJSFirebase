import {Chat} from 'models/database';
import {injectable} from 'tsyringe';
import BaseRepository from './baseRepository';

@injectable()
export default class ChatRepository extends BaseRepository<Chat> {
  constructor() {
    super(Chat);
  }
}
