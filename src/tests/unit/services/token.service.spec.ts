import {Test, TestingModule} from '@nestjs/testing';
import {v4 as uuidv4} from 'uuid';

import TokenService from '@common/token/token.service';
import {JwtService} from '@common/jwt/jwt.service';
import {ValidationService} from '@common/validation/validation.service';
import TokenRepository from '@domains/auth/token.repository';
import {UserDomainModel} from '@domains/models/user.model';
import {LoggerService} from '@common/logger/logger.service';
import {handleDatabaseError} from '@common/errors/handleDBErrors';
import {IToken, TokensModel} from '@infrastructure/database/models/token.model';
import {hashData} from '@common/helpers/hash';

jest.mock('@common/helpers/hash', () => ({
  hashData: jest.fn(data => `hashed-${data}`),
}));

jest.mock('@common/errors/handleDBErrors', () => ({
  handleDatabaseError: jest.fn(),
}));

const mockHandleDatabaseError = handleDatabaseError as unknown as jest.Mock;

describe('TokenService', () => {
  let service: TokenService;
  let jwtService: JwtService;
  let validationService: ValidationService;
  let tokenRepository: TokenRepository;
  let logger: LoggerService;

  const initialUser = {
    id: uuidv4(),
    email: 'test@example.com',
    role: 'user',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: {
            generateTokens: jest.fn(),
            generateForgotPasswordToken: jest.fn(),
          },
        },
        {
          provide: ValidationService,
          useValue: {
            validateRefreshToken: jest.fn(),
            validateAccessToken: jest.fn(),
            validateForgotPasswordToken: jest.fn(),
          },
        },
        {
          provide: TokenRepository,
          useValue: {
            findTokens: jest.fn(),
            updateTokens: jest.fn(),
            updateForgotPasswordToken: jest.fn(),
            clearRefreshToken: jest.fn(),
            createToken: jest.fn(),
          },
        },
        LoggerService,
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    jwtService = module.get<JwtService>(JwtService);
    validationService = module.get<ValidationService>(ValidationService);
    tokenRepository = module.get<TokenRepository>(TokenRepository);
    logger = module.get<LoggerService>(LoggerService);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  describe('generateTokensAndSave', () => {
    it('should generate new tokens and save them if no token data exists', async () => {
      const newTokens: TokensModel = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      const hashedRefreshToken = 'hashed-new-refresh-token';

      jest.spyOn(tokenRepository, 'findTokens').mockResolvedValue(null);
      jest.spyOn(jwtService, 'generateTokens').mockResolvedValue(newTokens);
      jest.mocked(hashData).mockResolvedValue(hashedRefreshToken);

      const result = await service.generateTokensAndSave(initialUser.id);

      console.log(result, 'result');

      expect(result).toEqual({
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
      });

      expect(tokenRepository.findTokens).toHaveBeenCalledWith({
        userId: initialUser.id,
      });
      expect(jwtService.generateTokens).toHaveBeenCalledWith({
        id: initialUser.id,
      });
    });

    it('should handle database errors during token generation', async () => {
      jest.spyOn(tokenRepository, 'createToken').mockImplementationOnce(() => {
        throw new Error('Database insertion failed');
      });

      mockHandleDatabaseError.mockImplementation(() => {
        throw new Error('Failed to generate and save tokens');
      });

      await expect(service.generateTokensAndSave('')).rejects.toThrow(
        'Failed to generate and save tokens',
      );
    });
  });

  describe('updateTokens', () => {
    it('should update tokens when token data exists', async () => {
      const existingTokenData: IToken = {
        userId: initialUser.id,
        refreshToken: 'sampleRefreshToken',
        forgotPasswordToken: 'sampleForgotPasswordToken',
      };

      const newTokens: TokensModel = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      const hashedRefreshToken = `hashed-${newTokens.refreshToken}`;

      jest
        .spyOn(tokenRepository, 'findTokens')
        .mockResolvedValue(existingTokenData);
      jest.spyOn(jwtService, 'generateTokens').mockResolvedValue(newTokens);
      jest.mocked(hashData).mockResolvedValue(hashedRefreshToken);
      jest.spyOn(tokenRepository, 'updateTokens').mockResolvedValue(undefined);

      const result = await service.updateTokens(
        initialUser.id,
        newTokens.refreshToken,
        existingTokenData.forgotPasswordToken,
      );

      expect(result.refreshToken).toBe(newTokens.refreshToken);

      expect(tokenRepository.findTokens).toHaveBeenCalledWith({
        userId: initialUser.id,
      });
      expect(jwtService.generateTokens).toHaveBeenCalledWith({
        id: initialUser.id,
      });
      expect(hashData).toHaveBeenCalledWith(newTokens.refreshToken);
      expect(tokenRepository.updateTokens).toHaveBeenCalledWith({
        userId: initialUser.id,
        refreshToken: hashedRefreshToken,
        forgotPasswordToken: existingTokenData.forgotPasswordToken,
      });
    });
  });

  describe('generateForgotPasswordToken', () => {
    it('should generate a forgot password token', async () => {
      const email = 'test@example.com';
      const forgotPasswordToken = 'forgot-password-token';

      jest
        .spyOn(jwtService, 'generateForgotPasswordToken')
        .mockResolvedValue(forgotPasswordToken);

      const result = await service.generateForgotPasswordToken(email);
      logger.log('Res', result);

      expect(jwtService.generateForgotPasswordToken).toHaveBeenCalledWith({
        email,
      });
      expect(result).toBe(forgotPasswordToken);
    });
  });

  describe('refresh', () => {
    it('should refresh tokens and save them', async () => {
      const tokenData = {
        id: uuidv4(),
        refreshToken: 'sampleRefreshToken',
        forgotPasswordToken: 'sampleForgotPasswordToken',
        userId: initialUser.id,
      };
      const existingTokenData: IToken = {
        userId: initialUser.id,
        refreshToken: 'sampleRefreshToken',
        forgotPasswordToken: 'sampleForgotPasswordToken',
      };
      const newTokens: TokensModel = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      jest
        .spyOn(tokenRepository, 'findTokens')
        .mockResolvedValue(existingTokenData);
      jest.spyOn(jwtService, 'generateTokens').mockResolvedValue(newTokens);
      jest.spyOn(validationService, 'validateRefreshToken').mockResolvedValue;
      jest.spyOn(tokenRepository, 'updateTokens').mockResolvedValue(null);

      const result = await service.refresh(
        tokenData.refreshToken,
        initialUser.id,
      );
      expect(validationService.validateRefreshToken).toHaveBeenCalledWith(
        tokenData.refreshToken,
        existingTokenData,
      );
      expect(jwtService.generateTokens).toHaveBeenCalledWith({
        id: initialUser.id,
      });
      expect(tokenRepository.updateTokens).toHaveBeenCalledWith({
        userId: initialUser.id,
        refreshToken: 'hashed-new-refresh-token',
      });
      expect(result).toEqual(newTokens);
    });

    it('should throw an error if refresh token is invalid', async () => {
      const userId = 'user-id-4';
      const refreshToken = 'invalid-refresh-token';

      jest.spyOn(tokenRepository, 'findTokens').mockResolvedValue(null);

      await expect(service.refresh(refreshToken, userId)).rejects.toThrowError(
        'Invalid refresh token',
      );
    });
  });

  describe('deleteToken', () => {
    it('should delete the token for a user', async () => {
      const userId = 'user-id-5';

      await service.deleteToken(userId);

      expect(tokenRepository.clearRefreshToken).toHaveBeenCalledWith(userId);
    });
  });

  describe('validateAccessToken', () => {
    it('should validate access token and return a user', async () => {
      const token = 'access-token';
      const user: UserDomainModel = {
        id: 'user-id',
        email: 'test@example.com',
        role: 'user',
      };

      jest
        .spyOn(validationService, 'validateAccessToken')
        .mockResolvedValue(user);

      const result = await service.validateAccessToken(token);

      expect(validationService.validateAccessToken).toHaveBeenCalledWith(token);
      expect(result).toEqual(user);
    });
  });

  describe('validateForgotPasswordToken', () => {
    it('should validate forgot password token', async () => {
      const token = 'forgot-password-token';

      jest
        .spyOn(validationService, 'validateForgotPasswordToken')
        .mockResolvedValue(true);

      const result = await service.validateForgotPasswordToken(token);

      expect(
        validationService.validateForgotPasswordToken,
      ).toHaveBeenCalledWith(token);
      expect(result).toBe(true);
    });
  });
});
