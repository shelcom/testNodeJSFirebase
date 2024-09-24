import {Injectable} from '@nestjs/common';

import {handleDatabaseError} from '@common/errors/handleDBErrors';
import {PasswordDatabaseModel} from '@infrastructure/database/models/password.model';
import BaseRepository from '@domains/base.repository';

@Injectable()
export default class PasswordRepository extends BaseRepository<PasswordDatabaseModel> {
  constructor() {
    super(PasswordDatabaseModel);
  }

  findPasswordsByUserId = async (
    condition: Partial<PasswordDatabaseModel>,
  ): Promise<PasswordDatabaseModel> => {
    try {
      const {userId} = condition;
      return (await this.model
        .query(this.knexInstance)
        .findOne({userId})) as PasswordDatabaseModel;
    } catch (error) {
      handleDatabaseError(error, 'Failed to find passwords for current user');
    }
  };

  updatePasswords = async (model: Record<string, any>): Promise<number> => {
    try {
      const {userId, ...updatePasswordData} = model;
      return await this.model
        .query(this.knexInstance)
        .patch(updatePasswordData)
        .where('userId', userId);
    } catch (error) {
      handleDatabaseError(error, 'Failed to update passwords');
    }
  };
}
