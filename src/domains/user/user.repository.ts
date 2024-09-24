import {Injectable} from '@nestjs/common';
import {Transaction} from 'objection';

import {UserDomainModel} from '@domains/models/user.model';
import {handleDatabaseError} from '@common/errors/handleDBErrors';
import {UserDatabaseModel} from '@infrastructure/database/models/user.model';
import BaseRepository from '@domains/base.repository';
import {LoggerService} from '@common/logger/logger.service';

@Injectable()
export default class UserRepository extends BaseRepository<UserDatabaseModel> {
  constructor(private readonly logger: LoggerService) {
    super(UserDatabaseModel);
  }

  async findByEmail(email: string): Promise<UserDomainModel | undefined> {
    try {
      const user = await this.findOneByCondition({email}, [
        'id',
        'email',
        'role',
      ]);
      if (user) {
        await user.$fetchGraph('passwords');
      }
      return user ? this.toDomainModel(user as UserDatabaseModel) : undefined;
    } catch (error) {
      handleDatabaseError(error, 'Failed to retrieve user by email.');
    }
  }

  async createUser(
    userData: Partial<UserDatabaseModel>,
  ): Promise<UserDomainModel> {
    try {
      const user = await this.create(userData);
      return this.toDomainModel(user);
    } catch (error) {
      handleDatabaseError(error, 'Failed to create user.');
    }
  }

  async updateUser(
    id: string,
    updateData: Partial<UserDatabaseModel>,
  ): Promise<number> {
    try {
      return await this.update({id, ...updateData});
    } catch (error) {
      handleDatabaseError(error, 'Failed to update user.');
    }
  }

  async deleteUser(id: string): Promise<number> {
    try {
      return await this.delete(id);
    } catch (error) {
      handleDatabaseError(error, 'Failed to delete user.');
    }
  }

  async transaction<T>(callback: (trx: Transaction) => Promise<T>): Promise<T> {
    try {
      return await this.model.transaction(this.knexInstance, callback);
    } catch (error) {
      handleDatabaseError(error, 'Failed to perform transaction.');
    }
  }

  private toDomainModel(user: UserDatabaseModel): UserDomainModel {
    return new UserDomainModel(user.id, user.email, user.role, user.passwords);
  }
}
