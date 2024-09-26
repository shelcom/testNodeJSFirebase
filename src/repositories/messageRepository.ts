import {Message} from 'models/database';
import {injectable} from 'tsyringe';
import BaseRepository from './baseRepository';

@injectable()
export default class MessageRepository extends BaseRepository<Message> {
  constructor() {
    super(Message);
  }
}
