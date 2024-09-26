import {User} from 'models/database';
import {injectable} from 'tsyringe';
import BaseRepository from './baseRepository';

@injectable()
export default class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User);
  }

  findUserWithPasskeysByCondition(condition: Object) {
    return this.findOneByCondition(condition, 'passkeys.authenticator');
  }

  findUserWithPasswordByCondition(condition: Object) {
    return this.findOneByCondition(condition, 'passwords');
  }
}
