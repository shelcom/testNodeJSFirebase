import ApiError from 'errors/ApiError';
import {hash, HashType} from 'helpers/hash';
import {IUser} from 'models/database/user';
import UserPasswordRepository from 'repositories/userPasswordRepository';
import {injectable} from 'tsyringe';
import TokenService from './tokenService';
import strings from 'strings';

@injectable()
export class UserPasswordService {
  constructor(
    private userPasswordRepository: UserPasswordRepository,
    private tokenService: TokenService,
  ) {}

  createPasswordForUser = async (userId: number, password: string) => {
    const hashedPassword = await hash(password, HashType.password);

    await this.userPasswordRepository.create({
      user_id: userId,
      password: hashedPassword,
    });
  };

  generateForgetPasswordToken = async (user: IUser) => {
    const token = this.tokenService.generateForgetPasswordToken(user.email);

    const userPassword = await this.userPasswordRepository.findOneByCondition({
      user_id: user.id,
    });

    if (userPassword) {
      userPassword.forget_password_token = token;
      this.userPasswordRepository.update(userPassword);
    } else {
      await this.userPasswordRepository.create({
        password: '',
        user_id: user.id,
        forget_password_token: token,
      });
    }

    return token;
  };

  updatePassword = async (userId: number, newPassword: string) => {
    const userPassword = await this.userPasswordRepository.findOneByCondition({
      user_id: userId,
    });

    if (!userPassword) {
      throw ApiError.unprocessableEntity(strings.user.tokenWasExpired);
    }

    userPassword.password = await hash(newPassword, HashType.password);
    userPassword.forget_password_token = null;
    await this.userPasswordRepository.update(userPassword);
  };
}
