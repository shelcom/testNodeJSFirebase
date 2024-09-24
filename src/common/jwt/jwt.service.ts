import {Injectable} from '@nestjs/common';
import {JwtService as NestJwtService} from '@nestjs/jwt';
import {
  InvalidTokenException,
  InvalidTokenFormatException,
  TokenExpiredException,
} from '@common/errors/authExceptions';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  generateTokens = async (data: {id: string}) => {
    const accessToken = await this.jwtService.signAsync(data, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '30m',
    });

    let refreshToken = await this.jwtService.signAsync(data, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '14d',
    });

    return {accessToken, refreshToken};
  };

  generateForgotPasswordToken = async (data: {email: string}) => {
    const forgotPasswordToken = await this.jwtService.signAsync(data, {
      secret: process.env.JWT_FORGOT_PASSWORD_SECRET,
      expiresIn: '1h',
    });
    return forgotPasswordToken;
  };

  validateTokens = async <T>(
    token: string,
    jwtSecretKey: string,
  ): Promise<T> => {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: jwtSecretKey,
      });
      return decoded;
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        throw new TokenExpiredException();
      } else if (e.name === 'JsonWebTokenError') {
        throw new InvalidTokenFormatException();
      } else {
        throw new InvalidTokenException();
      }
    }
  };
}
