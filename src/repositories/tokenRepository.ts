import {Token} from 'models/database';
import {injectable} from 'tsyringe';
import BaseRepository from './baseRepository';

@injectable()
export default class TokenRepository extends BaseRepository<Token> {
  constructor() {
    super(Token);
  }
}
