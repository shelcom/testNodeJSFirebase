import {HttpStatus} from '@nestjs/common';

type ErrorType = any[] | any;

export class ApiError extends Error {
  status: number;
  message: string;
  errors: ErrorType = [];

  constructor(status: number, message: string, errors: ErrorType = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static forbidden(message: string) {
    return new ApiError(HttpStatus.FORBIDDEN, message);
  }

  static notFound(message: string) {
    return new ApiError(HttpStatus.NOT_FOUND, message);
  }

  static unprocessableEntity(message: string, errors: ErrorType = []) {
    return new ApiError(HttpStatus.UNPROCESSABLE_ENTITY, message, errors);
  }

  static unauthorized(message: string) {
    return new ApiError(HttpStatus.UNAUTHORIZED, message);
  }

  static badRequest(message: string, errors: ErrorType = []) {
    return new ApiError(HttpStatus.BAD_REQUEST, message, errors);
  }

  static internal(message: string) {
    return new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, message);
  }

  static conflict(message: string) {
    return new ApiError(HttpStatus.CONFLICT, message);
  }

  // Method to convert ApiError to the format expected by HttpException
  toHttpExceptionResponse() {
    return {
      statusCode: this.status,
      message: this.message,
      errors: this.errors,
    };
  }
}
