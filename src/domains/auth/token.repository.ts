import {Injectable} from '@nestjs/common';

import {handleDatabaseError} from '@common/errors/handleDBErrors';
import {
  IToken,
  TokenDatabaseModel,
} from '@infrastructure/database/models/token.model';
import {Condition} from '@common/constants/constants';
import BaseRepository from '@domains/base.repository';

@Injectable()
export default class TokenRepository extends BaseRepository<TokenDatabaseModel> {
  constructor() {
    super(TokenDatabaseModel);
  }

  async createToken(
    data: Partial<TokenDatabaseModel>,
  ): Promise<TokenDatabaseModel> {
    try {
      const token = await this.create(data);
      return token;
    } catch (error) {
      handleDatabaseError(error, 'Failed to create token.');
      throw error;
    }
  }

  findTokens = async (condition: Condition): Promise<IToken | null> => {
    try {
      const tokenData = await this.findOneByCondition(condition);
      if (!tokenData) {
        return null;
      }

      const token: IToken = {
        userId: tokenData.userId,
        refreshToken: tokenData.refreshToken,
        forgotPasswordToken: tokenData.forgotPasswordToken,
      };
      return token;
    } catch (error) {
      handleDatabaseError(error, 'Failed to find tokens by condition');
      return null;
    }
  };

  updateForgotPasswordToken = async (
    userId: string,
    forgotPasswordToken: string,
  ): Promise<TokenDatabaseModel | null> => {
    try {
      const updatedToken = await this.updateTokens({
        userId,
        forgotPasswordToken,
      });
      return updatedToken;
    } catch (error) {
      handleDatabaseError(error, 'Failed to update forgot password token');
    }
  };

  updateTokens = async (
    condition: Condition,
  ): Promise<TokenDatabaseModel | null> => {
    try {
      const {userId, ...tokenData} = condition;
      const tokens = await this.model
        .query(this.knexInstance)
        .patch(tokenData)
        .where('userId', userId)
        .returning('*')
        .first();

      return tokens as unknown as TokenDatabaseModel;
    } catch (error) {
      handleDatabaseError(error, 'Failed to update tokens');
      throw error;
    }
  };

  clearRefreshToken = async (userId: string) => {
    try {
      await this.model
        .query(this.knexInstance)
        .patch({refreshToken: ''})
        .where('userId', userId);
    } catch (error) {
      handleDatabaseError(error, 'Failed to clear refresh token');
    }
  };
}
