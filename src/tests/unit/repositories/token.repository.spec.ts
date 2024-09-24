import {Test, TestingModule} from '@nestjs/testing';
import {v4 as uuidv4} from 'uuid';

import TokenRepository from '@domains/auth/token.repository';
import {handleDatabaseError} from '@common/errors/handleDBErrors';
import {DatabaseException} from '@common/errors/authExceptions';
import {LoggerService} from '@common/logger/logger.service';
import {TokenDatabaseModel} from '@infrastructure/database/models/token.model';

jest.mock('@common/errors/handleDBErrors', () => ({
  handleDatabaseError: jest.fn(),
}));

describe('TokenRepository', () => {
  let tokenRepository: TokenRepository;
  let logger: LoggerService;
  let mockModel: any;

  const initialUser = {
    id: uuidv4(),
    email: 'test@example.com',
    role: 'user',
  };
  const mockTokenData = {
    userId: initialUser.id,
    forgotPasswordToken: 'mockForgotPasswordToken',
    refreshToken: 'mockRefreshToken',
  };

  beforeAll(async () => {
    mockModel = {
      query: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenRepository,
        LoggerService,
        {provide: 'Model', useValue: mockModel},
      ],
    }).compile();

    logger = module.get<LoggerService>(LoggerService);
    tokenRepository = module.get<TokenRepository>(TokenRepository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createToken', () => {
    it('should create and return a token', async () => {
      const tokenData = {...mockTokenData, id: uuidv4()};
      jest.spyOn(tokenRepository, 'create').mockResolvedValue(tokenData as any);

      const result = await tokenRepository.createToken(mockTokenData);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.refreshToken).toBe(mockTokenData.refreshToken);
      expect(result.forgotPasswordToken).toBe(
        mockTokenData.forgotPasswordToken,
      );
    });

    it('should handle errors and throw an exception', async () => {
      jest
        .spyOn(tokenRepository, 'create')
        .mockRejectedValue(new Error('Database insertion failed'));

      await expect(tokenRepository.createToken(mockTokenData)).rejects.toThrow(
        Error,
      );
      expect(handleDatabaseError).toHaveBeenCalledWith(
        expect.any(Error),
        'Failed to create token.',
      );
    });
  });

  describe('findTokens', () => {
    it('should find and return a token by condition', async () => {
      const tokenData = {...mockTokenData, id: uuidv4()};
      jest
        .spyOn(tokenRepository, 'findOneByCondition')
        .mockResolvedValue(tokenData as any);

      const result = await tokenRepository.findTokens({
        userId: mockTokenData.userId,
      });

      expect(result).toBeDefined();
      expect(result.userId).toBe(mockTokenData.userId);
      expect(result.forgotPasswordToken).toBe(
        mockTokenData.forgotPasswordToken,
      );
      expect(result.refreshToken).toBe(mockTokenData.refreshToken);
    });

    it('should handle errors during token retrieval', async () => {
      jest
        .spyOn(tokenRepository, 'findOneByCondition')
        .mockRejectedValue(new Error('Database retrieval failed'));

      await expect(
        tokenRepository.findTokens({userId: 'invalid-id'}),
      ).rejects.toThrow(Error);
    });
  });

  describe('updateForgotPasswordToken', () => {
    it('should update and return the token', async () => {
      const updatedForgotPasswordToken = 'updatedForgotPasswordToken';
      const updatedTokenData = {
        ...mockTokenData,
        forgotPasswordToken: updatedForgotPasswordToken,
      };
      jest
        .spyOn(tokenRepository, 'updateTokens')
        .mockResolvedValue(updatedTokenData as any);

      const result = await tokenRepository.updateForgotPasswordToken(
        mockTokenData.userId,
        updatedForgotPasswordToken,
      );

      expect(result).toBeDefined();
      expect(result.forgotPasswordToken).toBe(updatedForgotPasswordToken);
    });

    it('should handle errors during forgot password token update', async () => {
      jest
        .spyOn(tokenRepository, 'updateTokens')
        .mockRejectedValue(new Error('Database update failed'));

      await expect(
        tokenRepository.updateForgotPasswordToken('invalid-id', 'token'),
      ).rejects.toThrow(DatabaseException);
    });
  });

  describe('clearRefreshToken', () => {
    it('should clear the refresh token for a given userId', async () => {
      const tokenData = {
        id: 'some-id',
        userId: mockTokenData.userId,
        refreshToken: mockTokenData.refreshToken,
        forgotPasswordToken: mockTokenData.forgotPasswordToken,
      } as TokenDatabaseModel;
      const updatedTokenData = {
        ...tokenData,
        refreshToken: '',
      } as TokenDatabaseModel;

      jest
        .spyOn(tokenRepository, 'updateTokens')
        .mockResolvedValueOnce(updatedTokenData);
      jest
        .spyOn(tokenRepository, 'findTokens')
        .mockResolvedValueOnce(updatedTokenData);

      await tokenRepository.clearRefreshToken(mockTokenData.userId);
      const result = await tokenRepository.findTokens({
        userId: mockTokenData.userId,
      });

      expect(result).toBeDefined();
      expect(result.refreshToken).toBe('');
    });

    it('should handle errors during clearing of refresh token', async () => {
      jest
        .spyOn(tokenRepository, 'updateTokens')
        .mockRejectedValueOnce(new Error('Database update failed'));

      await expect(
        tokenRepository.clearRefreshToken('invalid-id'),
      ).rejects.toThrow(DatabaseException);

      expect(handleDatabaseError).toHaveBeenCalledWith(
        expect.any(Error),
        'Failed to clear refresh token',
      );
    });
  });
});
