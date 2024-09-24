import {Injectable} from '@nestjs/common';

import {hashData} from '@common/helpers/hash';
import {PasswordDatabaseModel} from '@infrastructure/database/models/password.model';
import {verifyPassword} from '@common/helpers/hash';
import {PasswordsMatchException} from '@common/errors/authExceptions';
import PasswordRepository from '@domains/user/password.repository';
import {ChangePasswordDto} from '@api/user/dto/changePassword.dto';
import TokenService from '@common/token/token.service';

@Injectable()
export class PasswordService {
  constructor(
    private tokenService: TokenService,
    private paasswordRepository: PasswordRepository,
  ) {}

  createOrUpdatePasswordForUser = async (
    isExistingPassword: boolean,
    userId: string,
    hashedPassword: string,
  ) => {
    if (isExistingPassword) {
      await this.paasswordRepository.updatePasswords({
        userId: userId,
        password: hashedPassword,
      });

      const tokens = await this.tokenService.findTokens(userId);

      if (tokens.forgotPasswordToken) {
        tokens.forgotPasswordToken = '';
        await this.tokenService.updateTokens(
          tokens.userId,
          tokens.refreshToken,
          tokens.forgotPasswordToken,
        );
      }
    } else {
      await this.paasswordRepository.create({
        userId: userId,
        password: hashedPassword,
      });
    }
  };

  changePassword = async (passwordData: ChangePasswordDto, userId: string) => {
    const existingPassword: PasswordDatabaseModel =
      await this.paasswordRepository.findPasswordsByUserId({
        userId: userId,
      });
    const isPassworsdMatch = await verifyPassword(
      passwordData.oldPassword,
      existingPassword.password,
    );

    if (isPassworsdMatch) {
      const hashedPassword = await hashData(passwordData.newPassword);
      await this.createOrUpdatePasswordForUser(
        isPassworsdMatch,
        userId,
        hashedPassword,
      );
    } else {
      throw new PasswordsMatchException();
    }
  };

  generateForgotPasswordToken = async (
    email: string,
    userId: string,
  ): Promise<string> => {
    const forgotPasswordToken =
      await this.tokenService.generateForgotPasswordToken(email);

    await this.tokenService.updateForgotPasswordToken(
      userId,
      forgotPasswordToken,
    );

    return forgotPasswordToken;
  };
}
