import {UserPasskeys} from 'models/database/userPasskeys';
import {injectable} from 'tsyringe';
import BaseRepository from './baseRepository';

@injectable()
export default class UserPasskeysRepository extends BaseRepository<UserPasskeys> {
  constructor() {
    super(UserPasskeys);
  }
}
