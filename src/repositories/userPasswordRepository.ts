import {UserPassword} from 'models/database/userPassword';
import {injectable} from 'tsyringe';
import BaseRepository from './baseRepository';

@injectable()
export default class UserPasswordRepository extends BaseRepository<UserPassword> {
  constructor() {
    super(UserPassword);
  }
}
