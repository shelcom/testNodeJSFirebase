import {Injectable} from '@nestjs/common';

import {ChangePasswordDto} from './dto/changePassword.dto';
import UserRepository from '@domains/user/user.repository';
import {PasswordService} from '@common/password/password.service';
import {ValidationService} from '@common/validation/validation.service';
import {UserDomainModel} from '@domains/models/user.model';
import TokenService from '@common/token/token.service';

@Injectable()
export class UserService {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly validationService: ValidationService,
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository,
  ) {}

  changePassword = async (passwordData: ChangePasswordDto, userId: string) => {
    this.validationService.validateUserId(userId);

    await this.passwordService.changePassword(passwordData, userId);
  };

  recoverPassword = async (email: string): Promise<string> => {
    const user: UserDomainModel = await this.userRepository.findByEmail(email);

    this.validationService.validateUser(user);

    return await this.passwordService.generateForgotPasswordToken(
      email,
      user.id,
    );
  };

  logout = async (userId: string) => {
    this.validationService.validateUserId(userId);
    await this.tokenService.deleteToken(userId);
  };
}
