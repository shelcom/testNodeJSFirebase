import {ValidationError} from 'objection';
import {v4 as uuidv4} from 'uuid';

import {
  TokenDatabaseModel,
  TokenWithRelations,
} from '@infrastructure/database/models/token.model';
import {handleDatabaseError} from '@common/errors/handleDBErrors';
import {LoggerService} from '@common/logger/logger.service';
import {Test, TestingModule} from '@nestjs/testing';

jest.mock('@common/errors/handleDBErrors', () => ({
  handleDatabaseError: jest.fn(),
}));

jest.mock('@infrastructure/database/models/token.model', () => {
  return {
    TokenDatabaseModel: {
      query: jest.fn().mockReturnValue({
        insert: jest.fn(),
        where: jest.fn().mockReturnThis(),
        first: jest.fn(),
        patchAndFetchById: jest.fn(),
        deleteById: jest.fn(),
        findById: jest.fn(),
        withGraphFetched: jest.fn(),
      }),
    },
  };
});

describe('TokenDatabaseModel', () => {
  let logger: LoggerService;

  const initialUser = {
    id: uuidv4(),
    email: 'test@example.com',
    role: 'user',
  };
  const tokenData = {
    id: uuidv4(),
    refreshToken: 'sampleRefreshToken',
    forgotPasswordToken: 'sampleForgotPasswordToken',
    userId: initialUser.id,
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerService],
    }).compile();

    logger = module.get<LoggerService>(LoggerService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createToken', () => {
    it('should create and return a token', async () => {
      const mockInsert = jest.fn().mockResolvedValue(tokenData);
      (TokenDatabaseModel.query as jest.Mock).mockReturnValue({
        insert: mockInsert,
      });
      const createdToken = await TokenDatabaseModel.query().insert(tokenData);

      expect(createdToken).toBeDefined();
      expect(createdToken.refreshToken).toBe(tokenData.refreshToken);
      expect(createdToken.forgotPasswordToken).toBe(
        tokenData.forgotPasswordToken,
      );
      expect(createdToken.userId).toBe(tokenData.userId);
      expect(TokenDatabaseModel.query().insert).toHaveBeenCalledWith(tokenData);
    });

    it('should handle database errors when creating a token', async () => {
      const invalidTokenData = {
        id: uuidv4(),
        refreshToken: 'invalidToken',
        forgotPasswordToken: 'invalidForgotPasswordToken',
        userId: 'non-existent-user-id',
      };

      const mockError = new Error('Database insertion failed');
      jest.spyOn(TokenDatabaseModel, 'query').mockReturnValueOnce({
        insert: jest.fn().mockRejectedValueOnce(mockError),
      } as any);

      await expect(
        TokenDatabaseModel.query().insert(invalidTokenData),
      ).rejects.toThrow(mockError);
    });

    it('should handle validation errors when creating a token with missing userId', async () => {
      const invalidTokenData = {
        id: uuidv4(),
        refreshToken: 'someToken',
        forgotPasswordToken: 'someForgotPasswordToken',
        // userId is missing
      };

      try {
        await TokenDatabaseModel.query().insert(invalidTokenData);
      } catch (error) {
        handleDatabaseError(logger, error);
        expect(error).toBeInstanceOf(ValidationError);
        expect(handleDatabaseError).toHaveBeenCalledWith(error);
      }
    });

    it('should handle errors when creating a token with a duplicate id', async () => {
      const tokenData = {
        id: uuidv4(),
        refreshToken: 'validToken',
        forgotPasswordToken: 'validForgotPasswordToken',
        userId: initialUser.id,
      };

      try {
        await TokenDatabaseModel.query().insert(tokenData);
        await TokenDatabaseModel.query().insert(tokenData);
      } catch (error) {
        handleDatabaseError(logger, error);
        expect(handleDatabaseError).toHaveBeenCalledWith(error);
      }
    });
  });

  describe('findToken', () => {
    it('should have a relation with User', async () => {
      const tokenData = {
        id: uuidv4(),
        refreshToken: 'sampleRefreshToken',
        forgotPasswordToken: 'sampleForgotPasswordToken',
        userId: initialUser.id,
      };
      const mockUser = {
        id: initialUser.id,
        email: initialUser.email,
        role: initialUser.role,
      };

      const mockQuery = {
        insert: jest.fn().mockResolvedValueOnce(tokenData),
        findById: jest.fn().mockReturnValue({
          withGraphFetched: jest.fn().mockResolvedValueOnce({
            ...tokenData,
            user: mockUser,
          } as TokenWithRelations),
        }),
        withGraphFetched: jest.fn().mockImplementation(relation => {
          if (relation === 'user') {
            return mockQuery.findById();
          }
          return mockQuery;
        }),
      };
      (TokenDatabaseModel.query as jest.Mock).mockReturnValue(mockQuery);
      await TokenDatabaseModel.query().insert(tokenData);

      const tokenWithUser = await TokenDatabaseModel.query()
        .findById(tokenData.id)
        .withGraphFetched('user');
      const tokenWithUserTyped = tokenWithUser as TokenWithRelations;

      expect(tokenWithUserTyped).toBeDefined();
      if (tokenWithUserTyped) {
        expect(tokenWithUserTyped.user).toBeDefined();
        expect(tokenWithUserTyped.user?.id).toBe(initialUser.id);
        expect(tokenWithUserTyped.user?.email).toBe(initialUser.email);
        expect(tokenWithUserTyped.user?.role).toBe(initialUser.role);
      }
    });
  });

  describe('updateToken', () => {
    it('should update a token', async () => {
      const initialData = {
        id: uuidv4(),
        refreshToken: 'initialToken',
        forgotPasswordToken: 'initialForgotPasswordToken',
        userId: initialUser.id,
      };
      const updatedData = {
        refreshToken: 'updatedToken',
        forgotPasswordToken: 'updatedForgotPasswordToken',
      };

      const mockQuery = {
        insert: jest.fn().mockResolvedValueOnce(initialData),
        patchAndFetchById: jest.fn().mockResolvedValueOnce({
          ...initialData,
          ...updatedData,
        }),
      };
      (TokenDatabaseModel.query as jest.Mock)
        .mockReturnValueOnce(mockQuery)
        .mockReturnValueOnce(mockQuery);

      await TokenDatabaseModel.query().insert(initialData);
      const updatedToken = await TokenDatabaseModel.query().patchAndFetchById(
        initialData.id,
        updatedData,
      );

      expect(updatedToken).toBeDefined();
      expect(updatedToken.refreshToken).toBe(updatedData.refreshToken);
      expect(updatedToken.forgotPasswordToken).toBe(
        updatedData.forgotPasswordToken,
      );
    });

    it('should handle database errors when updating a token with an invalid field', async () => {
      const tokenData = {
        id: uuidv4(),
        refreshToken: 'updateToken',
        forgotPasswordToken: 'updateForgotPasswordToken',
        userId: initialUser.id,
      };

      const mockQuery = {
        insert: jest.fn().mockResolvedValueOnce(tokenData),
        patch: jest.fn().mockReturnThis(),
        where: jest.fn().mockRejectedValueOnce(new TypeError('Invalid field')),
      };
      (TokenDatabaseModel.query as jest.Mock).mockReturnValue(mockQuery);
      const createdToken = await TokenDatabaseModel.query().insert(tokenData);

      try {
        await TokenDatabaseModel.query()
          .patch({nonExistentField: 'someValue'} as any)
          .where('id', createdToken.id);
      } catch (error) {
        handleDatabaseError(logger, error);
        expect(handleDatabaseError).toHaveBeenCalledWith(logger, error);
        expect(error).toBeInstanceOf(TypeError);
        expect(error.message).toBe('Invalid field');
      }
    });
  });

  describe('deleteToken', () => {
    it('should delete a token', async () => {
      const tokenData = {
        id: uuidv4(),
        refreshToken: 'sampleRefreshToken',
        forgotPasswordToken: 'sampleForgotPasswordToken',
        userId: initialUser.id,
      };

      const mockQuery = {
        insert: jest.fn().mockResolvedValueOnce(tokenData),
        deleteById: jest.fn().mockResolvedValueOnce(1),
        findById: jest.fn().mockResolvedValueOnce(undefined),
      };
      (TokenDatabaseModel.query as jest.Mock).mockReturnValue(mockQuery);
      await TokenDatabaseModel.query().insert(tokenData);
      const deletedCount = await TokenDatabaseModel.query().deleteById(
        tokenData.id,
      );
      const result = await TokenDatabaseModel.query().findById(tokenData.id);

      expect(deletedCount).toBe(1);
      expect(result).toBeUndefined();
    });

    it('should handle errors when deleting a non-existent token', async () => {
      const mockQuery = {
        deleteById: jest
          .fn()
          .mockRejectedValueOnce(new TypeError('deleteById is not a function')),
      };
      (TokenDatabaseModel.query as jest.Mock).mockReturnValue(mockQuery);

      try {
        await TokenDatabaseModel.query().deleteById('non-existent-id');
      } catch (error) {
        handleDatabaseError(logger, error);
        expect(handleDatabaseError).toHaveBeenCalledWith(logger, error);
        expect(error).toBeInstanceOf(TypeError);
        expect(error.message).toBe('deleteById is not a function');
      }
    });
  });
});
