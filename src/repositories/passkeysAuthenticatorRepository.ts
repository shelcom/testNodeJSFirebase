import {PasskeysAuthenticator} from 'models/database/passkeysAuthenticator';
import {injectable} from 'tsyringe';
import BaseRepository from './baseRepository';

@injectable()
export default class PasskeysAuthenticatorRepository extends BaseRepository<PasskeysAuthenticator> {
  constructor() {
    super(PasskeysAuthenticator);
  }
}
