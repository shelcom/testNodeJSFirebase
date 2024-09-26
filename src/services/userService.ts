import ApiError from 'errors/ApiError';
import {IUser} from 'models/database/user';
import TokenService from './tokenService';
import strings from 'strings';
import {injectable} from 'tsyringe';
import UserRepository from 'repositories/userRepository';
import EmailService from './emailService';
import {TokensModel} from 'models/tokensModel';
import {
  LoginPasskeysOptionsModel,
  RegistrationPasskeysOptionsModel,
  UserPasskeysService,
} from './userPasskeysService';
import {UserPasswordService} from './userPasswordService';
import {compareStrings, HashType} from 'helpers/hash';

@injectable()
class UserService {
  constructor(
    private tokenService: TokenService,
    private userRepository: UserRepository,
    private emailService: EmailService,
    private userPasskeysService: UserPasskeysService,
    private userPasswordService: UserPasswordService,
  ) {}

  registration = async (email: string, password: string, role: string) => {
    const user = await this.userRepository.findUserWithPasswordByCondition({
      email,
    });

    if (user) {
      throw ApiError.unprocessableEntity(strings.user.emailAlreadyInUse);
    }

    const newUser = await this.userRepository.create({
      email,
      role,
    });

    await this.userPasswordService.createPasswordForUser(newUser.id, password);

    const tokens = await this.tokenService.generateTokensAndSave({
      email,
      id: newUser.id,
      role,
    });

    return this.prepareUserInfoForResponse(tokens, newUser);
  };

  registrationPasskeysInitialize = async (email: string, role: string) => {
    let user = await this.userRepository.findUserWithPasskeysByCondition({
      email,
    });

    if (user?.passkeys?.authenticator) {
      throw ApiError.unprocessableEntity(strings.user.emailAlreadyInUse);
    }

    if (!user) {
      user = await this.userRepository.create({
        email,
        role,
      });
    }

    let challenge = user.passkeys?.challenge;
    if (!challenge) {
      challenge = await this.userPasskeysService.createForRegistration(user);
    }

    return {
      challenge: challenge,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  };

  registrationPasskeysFinalize = async (
    id: number,
    registrationOptions: RegistrationPasskeysOptionsModel,
  ) => {
    const user = await this.userRepository.findUserWithPasskeysByCondition({
      id,
    });

    if (!user?.passkeys) {
      throw ApiError.notFound(strings.user.wrongUserId);
    }

    if (user.passkeys?.authenticator) {
      throw ApiError.unprocessableEntity(strings.user.alreadyFinalized);
    }

    await this.userPasskeysService.verifyRegistration(
      user.passkeys.id,
      registrationOptions,
    );

    const tokens = await this.tokenService.generateTokensAndSave({
      email: user.email,
      id: user.id,
      role: user.role,
    });

    return this.prepareUserInfoForResponse(tokens, user);
  };

  loginPasskeysInitialize = async (email: string) => {
    const user = await this.userRepository.findUserWithPasskeysByCondition({
      email,
    });

    if (!user?.passkeys?.authenticator) {
      throw ApiError.notFound(strings.user.isNotRegistered);
    }

    return {
      challenge: user.passkeys.challenge,
      credentialID: user.passkeys.credential_id,
    };
  };

  loginPasskeysFinalize = async (loginOptions: LoginPasskeysOptionsModel) => {
    const user = await this.userRepository.findUserWithPasskeysByCondition({
      email: loginOptions.email,
    });

    if (!user) {
      throw ApiError.notFound(strings.user.userWasNotFound);
    }

    if (!user.passkeys.authenticator) {
      throw ApiError.unprocessableEntity(strings.user.isNotRegistered);
    }

    await this.userPasskeysService.verifyLogin(user.passkeys, loginOptions);

    const tokens = await this.tokenService.generateTokensAndSave({
      email: loginOptions.email,
      id: user.id,
      role: user.role,
    });

    return this.prepareUserInfoForResponse(tokens, user);
  };

  login = async (email: string, password: string) => {
    const user = await this.userRepository.findUserWithPasswordByCondition({
      email,
    });

    if (!user) {
      throw ApiError.notFound(strings.user.isNotRegistered);
    }

    if (!user.passwords) {
      throw ApiError.unprocessableEntity(strings.user.wrongPassword);
    }

    const comparePassword = compareStrings(
      password,
      user.passwords?.password,
      HashType.password,
    );

    if (!comparePassword) {
      throw ApiError.unprocessableEntity(strings.user.wrongPassword);
    }

    const tokens = await this.tokenService.generateTokensAndSave({
      email,
      id: user.id,
      role: user.role,
    });

    return this.prepareUserInfoForResponse(tokens, user);
  };

  logout = async (user: IUser) => {
    return await this.tokenService.deleteToken(user.id);
  };

  refresh = async (refreshToken: string) => {
    const data = await this.tokenService.refresh(refreshToken);
    return data;
  };

  forgetPassword = async (baseLink: string, email: string) => {
    const user = await this.userRepository.findOneByCondition({email});
    if (user) {
      const token = await this.userPasswordService.generateForgetPasswordToken(
        user,
      );

      const link = `${baseLink}?reset_token=${token}`;
      this.emailService.sendForgetPasswordMail(email, link);
    }
  };

  recoverPassword = async (token: string, newPassword: string) => {
    const decodedToken = this.tokenService.validateForgetPasswordToken(token);
    if (!decodedToken) {
      throw ApiError.unprocessableEntity(strings.user.tokenWasExpired);
    }

    const email = decodedToken.email;
    const user = await this.userRepository.findUserWithPasswordByCondition({
      email,
    });

    if (!user.passwords || user.passwords.forget_password_token !== token) {
      throw ApiError.unprocessableEntity(strings.user.tokenWasExpired);
    }

    this.userPasswordService.updatePassword(user.id, newPassword);
  };

  private prepareUserInfoForResponse = (tokens: TokensModel, user: IUser) => {
    return {
      tokens,
      user: {
        id: user.id,
        role: user.role,
        email: user.email,
      },
    };
  };
}

export default UserService;
