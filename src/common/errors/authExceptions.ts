import {HttpException} from '@nestjs/common';
import {ApiError} from '@common/errors/apiErrors';

export class EmailAlreadyInUseException extends HttpException {
  constructor() {
    const apiError = ApiError.conflict(
      'User with this email is already in the system',
    );
    super(apiError.toHttpExceptionResponse(), apiError.status);
  }
}

export class UserNotFoundException extends HttpException {
  constructor(email: string) {
    const apiError = ApiError.notFound(
      `Havent user with this email in the system: ${email}`,
    );
    super(apiError.toHttpExceptionResponse(), apiError.status);
  }
}

export class WrongPasswordException extends HttpException {
  constructor() {
    const apiError = ApiError.unauthorized('Wrong password provided');
    super(apiError.toHttpExceptionResponse(), apiError.status);
  }
}

export class PasswordsMatchException extends HttpException {
  constructor() {
    const apiError = ApiError.badRequest(
      'Old password not equal existing password',
    );
    super(apiError.toHttpExceptionResponse(), apiError.status);
  }
}

export class UserHasNoPasswordException extends HttpException {
  constructor() {
    const apiError = ApiError.badRequest("User hasn't password");
    super(apiError.toHttpExceptionResponse(), apiError.status);
  }
}

export class UserNotLoggedInException extends HttpException {
  constructor() {
    const apiError = ApiError.badRequest('You are not logged in');
    super(apiError.toHttpExceptionResponse(), apiError.status);
  }
}

export class InvalidUserIdFormatException extends HttpException {
  constructor() {
    const apiError = ApiError.badRequest('Invalid User Id format');
    super(apiError.toHttpExceptionResponse(), apiError.status);
  }
}

export class InvalidCredentialsException extends HttpException {
  constructor() {
    const apiError = ApiError.unauthorized('Invalid credentials provided');
    super(apiError.toHttpExceptionResponse(), apiError.status);
  }
}

export class RefreshTokenExpiredException extends HttpException {
  constructor() {
    const apiError = ApiError.unauthorized(
      'Refresh token has expired or not valid',
    );
    super(apiError.toHttpExceptionResponse(), apiError.status);
  }
}

export class RefreshTokenNotFoundException extends HttpException {
  constructor() {
    const apiError = ApiError.badRequest('Refresh token not found');
    super(apiError.toHttpExceptionResponse(), apiError.status);
  }
}

export class AccessTokenExpiredException extends HttpException {
  constructor() {
    const apiError = ApiError.forbidden('Access token has expired');
    super(apiError.toHttpExceptionResponse(), apiError.status);
  }
}

export class InvalidTokenFormatException extends HttpException {
  constructor() {
    const apiError = ApiError.badRequest('Invalid token format');
    super(apiError.toHttpExceptionResponse(), apiError.status);
  }
}

export class InvalidTokenException extends HttpException {
  constructor() {
    const apiError = ApiError.unauthorized('Invalid token');
    super(apiError.toHttpExceptionResponse(), apiError.status);
  }
}

export class InvalidAccessTokenException extends HttpException {
  constructor() {
    const apiError = ApiError.unauthorized('Invalid access token');
    super(apiError.toHttpExceptionResponse(), apiError.status);
  }
}

export class TokenRequiredException extends HttpException {
  constructor() {
    const apiError = ApiError.badRequest('Token is required');
    super(apiError.toHttpExceptionResponse(), apiError.status);
  }
}

export class TokenExpiredException extends HttpException {
  constructor() {
    const apiError = ApiError.badRequest('Token has expired');
    super(apiError.toHttpExceptionResponse(), apiError.status);
  }
}

export class AuthHeaderNotFoundException extends HttpException {
  constructor() {
    const apiError = ApiError.unauthorized('Authorization header not found');
    super(apiError.toHttpExceptionResponse(), apiError.status);
  }
}

export class DatabaseException extends HttpException {
  constructor(message: string) {
    const apiError = ApiError.internal(message);
    super(apiError.toHttpExceptionResponse(), apiError.status);
  }
}
