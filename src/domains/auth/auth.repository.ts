import {Injectable} from '@nestjs/common';

import {handleDatabaseError} from '@common/errors/handleDBErrors';
import {UserDatabaseModel} from '@infrastructure/database/models/user.model';
import BaseRepository from '@domains/base.repository';
import {UserDomainModel} from '@domains/models/user.model';
import {LoggerService} from '@common/logger/logger.service';

@Injectable()
export default class AuthRepository extends BaseRepository<UserDatabaseModel> {
  constructor(
    private readonly logger: LoggerService, // Injecting the LoggerService
  ) {
    super(UserDatabaseModel);
  }

  async createUser(data: Partial<UserDatabaseModel>): Promise<UserDomainModel> {
    try {
      const user = await this.create(data);
      return this.toDomainModel(user);
    } catch (error) {
      handleDatabaseError(error, 'Failed to create user.');
      throw error;
    }
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

  private toDomainModel(user: UserDatabaseModel): UserDomainModel {
    return new UserDomainModel(user.id, user.email, user.role, user.passwords);
  }
}
