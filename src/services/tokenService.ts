import ApiError from 'errors/ApiError';
import {hash, HashType} from 'helpers/hash';
import jwt from 'jsonwebtoken';
import {IUser} from 'models/database/user';
import TokenRepository from 'repositories/tokenRepository';
import {injectable} from 'tsyringe';

@injectable()
class TokenService {
  constructor(private tokenRepository: TokenRepository) {}

  private generateTokens = (data: IUser) => {
    const accessToken = jwt.sign(data, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '30m',
    });

    const refreshToken = jwt.sign(data, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '7d',
    });
    
    return {accessToken, refreshToken};
  };

  private saveRefreshTokenToken = async (
    userId: number,
    refreshToken: string,
  ) => {
    const tokenData = await this.tokenRepository.findOneByCondition({userId});
    if (tokenData) {
      tokenData.refresh_token = hash(refreshToken, HashType.token);
      await this.tokenRepository.update(tokenData);
      return tokenData;
    }
    const newToken = await this.tokenRepository.create({
      userId,
      refresh_token: hash(refreshToken, HashType.token),
    });
    return newToken;
  };

  generateTokensAndSave = async (user: IUser) => {
    const tokens = this.generateTokens(user);
    await this.saveRefreshTokenToken(user.id, tokens.refreshToken);
    return tokens;
  };

  generateForgetPasswordToken = (email: string) => {
    const forgetPasswordToken = jwt.sign(
      {email},
      process.env.JWT_FORGET_PASSWORD_SECRET,
      {
        expiresIn: '1h',
      },
    );
    return forgetPasswordToken;
  };

  validateForgetPasswordToken = (token: string) => {
    return this.validateToken(token, process.env.JWT_FORGET_PASSWORD_SECRET);
  };

  validateRefreshToken = (token: string) => {
    return this.validateToken(token, process.env.JWT_REFRESH_SECRET);
  };

  refresh = async (refreshToken: string) => {
    const tokenData = await this.tokenRepository.findOneByCondition({
      refresh_token: hash(refreshToken, HashType.token),
    });

    if (!tokenData) {
      throw ApiError.unauthorized();
    }

    const userData = this.validateRefreshToken(refreshToken) as IUser;
    if (!userData) {
      throw ApiError.unauthorized();
    }

    const tokens = await this.generateTokensAndSave({
      email: userData.email,
      id: userData.id,
      role: userData.role,
    });

    return tokens;
  };

  deleteToken = async (userId: number) => {
    return await this.tokenRepository.deleteWhere('userId', userId);
  };

  private validateToken = (token: string, jwtSecretKey: string): any | null => {
    try {
      const decoded = jwt.verify(token, jwtSecretKey);
      return decoded;
    } catch (e) {
      return null;
    }
  };
}

export default TokenService;
