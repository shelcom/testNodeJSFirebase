import {Injectable} from '@nestjs/common';

import {IUser, UserRole} from '@infrastructure/database/models/user.model';
import {TokensModel} from '@infrastructure/database/models/token.model';
import {PasswordService} from '@common/password/password.service';
import TokenService from '@common/token/token.service';
import {hashData} from '@common/helpers/hash';
import {EmailAlreadyInUseException} from '@common/errors/authExceptions';
import AuthRepository from '@domains/auth/auth.repository';
import {ValidationService} from '@common/validation/validation.service';
import {CreateUserDto} from './dto/createUser.dto';
import {LoginUserDto} from './dto/loginUser.dto';
import {UserDomainModel} from '@domains/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly userPasswordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly validationService: ValidationService,
    private readonly authRepository: AuthRepository,
  ) {}

  createUser = async (
    user: CreateUserDto,
  ): Promise<{token: TokensModel; user: IUser}> => {
    const {email, password} = user;
    const defaultRole = UserRole.user;

    const oldUser: UserDomainModel =
      await this.authRepository.findByEmail(email);
    if (oldUser) {
      throw new EmailAlreadyInUseException();
    }

    const newUser: UserDomainModel = await this.authRepository.createUser({
      email: email,
      role: defaultRole,
    });
    const hashedPassword = await hashData(password);
    await this.userPasswordService.createOrUpdatePasswordForUser(
      false,
      newUser.id,
      hashedPassword,
    );
    const tokens: TokensModel = await this.tokenService.generateTokensAndSave(
      newUser.id,
    );

    return {
      ...this.returnUserFields(tokens, newUser),
    };
  };

  login = async (
    userData: LoginUserDto,
  ): Promise<{token: TokensModel; user: IUser}> => {
    const {email, password} = userData;
    const user: UserDomainModel = await this.authRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    this.validationService.validateUserId(user.id);

    this.validationService.validateUserPassword(
      password,
      user.passwords.password,
    );

    const tokens: TokensModel = await this.tokenService.generateTokensAndSave(
      user.id,
    );

    return {
      ...this.returnUserFields(tokens, user),
    };
  };

  refresh = async (refreshToken: string, userId: string) => {
    this.validationService.validateUserId(userId);
    return await this.tokenService.refresh(refreshToken, userId);
  };

  private returnUserFields = (
    tokens: TokensModel,
    user: IUser,
  ): {user: IUser; token: TokensModel} => {
    return {
      token: tokens,
      user: {
        id: user.id,
        role: user.role,
        email: user.email,
      },
    };
  };
}
