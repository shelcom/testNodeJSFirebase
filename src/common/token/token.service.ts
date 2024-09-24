import {Injectable} from '@nestjs/common';

import {
  TokensModel,
  TokenDatabaseModel,
  IToken,
} from '@infrastructure/database/models/token.model';
import {hashData} from '@common/helpers/hash';
import {JwtService} from '@common/jwt/jwt.service';
import {ValidationService} from '@common/validation/validation.service';
import TokenRepository from '@domains/auth/token.repository';
import {UserDomainModel} from '@domains/models/user.model';
import {handleDatabaseError} from '@common/errors/handleDBErrors';
import {LoggerService} from '@common/logger/logger.service';

@Injectable()
class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly validationService: ValidationService,
    private readonly tokenRepository: TokenRepository,
    private readonly logger: LoggerService,
  ) {}

  async generateTokensAndSave(userId: string): Promise<TokensModel> {
    try {
      const tokenData = await this.findTokens(userId);
      const newTokens = await this.generateTokens(userId);
      const savedTokens = await this.saveTokens(tokenData, newTokens);

      return {
        accessToken: newTokens.accessToken,
        refreshToken: savedTokens.refreshToken,
      };
    } catch (error) {
      this.handleServiceError(error, 'Failed to generate and save tokens');
    }
  }

  async generateForgotPasswordToken(email: string): Promise<string> {
    const data = {email};
    return this.jwtService.generateForgotPasswordToken(data);
  }

  async updateTokens(
    userId: string,
    refreshToken: string,
    forgotPasswordToken: string,
  ): Promise<IToken> {
    const hashedRefreshToken = await hashData(refreshToken);
    const tokenData = {
      userId,
      refreshToken: hashedRefreshToken,
      forgotPasswordToken,
    };
    return this.saveOrUpdateTokens(true, tokenData);
  }

  async updateForgotPasswordToken(
    userId: string,
    forgotPasswordToken: string,
  ): Promise<void> {
    await this.tokenRepository.updateForgotPasswordToken(
      userId,
      forgotPasswordToken,
    );
  }

  async deleteToken(userId: string): Promise<void> {
    await this.tokenRepository.clearRefreshToken(userId);
  }

  async validateAccessToken(token: string): Promise<UserDomainModel> {
    return this.validationService.validateAccessToken<UserDomainModel>(token);
  }

  async validateForgotPasswordToken(token: string): Promise<void> {
    return this.validationService.validateForgotPasswordToken(token);
  }

  async refresh(refreshToken: string, userId: string): Promise<TokensModel> {
    const tokenData = await this.findTokens(userId);
    this.validationService.validateRefreshToken(refreshToken, tokenData);

    const newTokens = await this.generateTokens(userId);
    const oldTokensData: IToken = {
      userId: tokenData.userId,
      forgotPasswordToken: tokenData.forgotPasswordToken,
      refreshToken: '',
    };
    const savedTokens = await this.saveTokens(oldTokensData, newTokens);

    return {
      accessToken: newTokens.accessToken,
      refreshToken: savedTokens.refreshToken,
    };
  }

  async findTokens(userId: string): Promise<IToken | null> {
    return await this.tokenRepository.findTokens({userId});
  }

  private async saveTokens(
    oldtokenData: IToken | null,
    newTokens: TokensModel,
  ): Promise<IToken> {
    const {refreshToken: newRefreshToken} = newTokens;
    const hashedRefreshToken = await hashData(newRefreshToken);

    const savedTokens = await this.saveOrUpdateTokens(Boolean(oldtokenData), {
      userId: oldtokenData?.userId || '',
      refreshToken: hashedRefreshToken,
      forgotPasswordToken: oldtokenData?.forgotPasswordToken ?? '',
    });

    savedTokens.refreshToken = newRefreshToken;
    return savedTokens;
  }

  private async saveOrUpdateTokens(
    updateToken: boolean,
    tokenData: IToken,
  ): Promise<IToken> {
    this.logger.log('Updating token:', updateToken);
    if (updateToken) {
      await this.tokenRepository.updateTokens(tokenData);
    } else {
      await this.tokenRepository.createToken(tokenData);
    }
    return tokenData;
  }

  private handleServiceError(error: Error, message: string): void {
    handleDatabaseError(this.logger, error);
  }

  private async generateTokens(userId: string): Promise<TokensModel> {
    const tokens = await this.jwtService.generateTokens({id: userId});
    this.logger.log('Generated new tokens:', tokens);
    return tokens;
  }
}

export default TokenService;
