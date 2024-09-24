import {Injectable} from '@nestjs/common';

import {verifyPassword, verifyRefreshToken} from '@common/helpers/hash';
import {
  IToken,
  TokenDatabaseModel,
} from '@infrastructure/database/models/token.model';
import {
  InvalidUserIdFormatException,
  RefreshTokenExpiredException,
  RefreshTokenNotFoundException,
  UserHasNoPasswordException,
  UserNotFoundException,
  UserNotLoggedInException,
  WrongPasswordException,
} from '@common/errors/authExceptions';
import {isValidUUID} from '@common/utils/validation';
import {UserDomainModel} from '@domains/models/user.model';
import {JwtService} from '@common/jwt/jwt.service';

@Injectable()
export class ValidationService {
  constructor(private readonly jwtService: JwtService) {}

  validateUserId = (userId: string | null) => {
    if (!userId) {
      throw new UserNotLoggedInException();
    }

    if (!isValidUUID(userId)) {
      throw new InvalidUserIdFormatException();
    }
  };

  validateUser = (user: UserDomainModel) => {
    if (!user) {
      throw new UserNotFoundException(user.email);
    } else if (!user.passwords) {
      throw new UserHasNoPasswordException();
    }
  };

  validateUserPassword = async (password: string, hashedPassword: string) => {
    try {
      await verifyPassword(password, hashedPassword);
    } catch (error) {
      if (error instanceof WrongPasswordException) {
        throw error;
      }

      throw new WrongPasswordException();
    }
  };

  validateAccessToken = async <T>(accessToken: string): Promise<T> => {
    return await this.jwtService.validateTokens<T>(
      accessToken,
      process.env.JWT_ACCESS_SECRET,
    );
  };

  validateForgotPasswordToken = async <T>(
    forgotPasswordToken: string,
  ): Promise<T> => {
    return await this.jwtService.validateTokens<T>(
      forgotPasswordToken,
      process.env.JWT_FORGOT_PASSWORD_SECRET,
    );
  };

  validateRefreshToken = async (refreshToken: string, tokenData: IToken) => {
    if (!tokenData || !tokenData.refreshToken) {
      throw new RefreshTokenNotFoundException();
    }
    const isRefreshTokenVerify = await verifyRefreshToken(
      refreshToken,
      tokenData.refreshToken,
    );
    if (!isRefreshTokenVerify) {
      throw new RefreshTokenExpiredException();
    }

    await this.jwtService.validateTokens(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
    );
  };
}
