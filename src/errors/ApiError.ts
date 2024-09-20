import HttpStatus, {StatusCodes} from 'http-status-codes';
import strings from 'strings';

type ErrorType = any[] | any;

class ApiError extends Error {
  status: StatusCodes;
  errors: ErrorType = [];

  constructor(status: number, message: string, errors: ErrorType = []) {
    super();
    this.status = status;
    this.message = message;
    this.errors = errors;
  }

  static forbidden() {
    return new ApiError(HttpStatus.FORBIDDEN, strings.common.forbidden);
  }

  static notFound(message: string) {
    return new ApiError(HttpStatus.NOT_FOUND, message);
  }

  static unprocessableEntity(message: string, errors: ErrorType = []) {
    return new ApiError(HttpStatus.UNPROCESSABLE_ENTITY, message, errors);
  }

  static unauthorized() {
    return new ApiError(HttpStatus.UNAUTHORIZED, strings.common.notAuthorized);
  }

  static badRequest(message: string, errors: any[] = []) {
    return new ApiError(HttpStatus.BAD_REQUEST, message, errors);
  }

  static internal(message: string) {
    return new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, message);
  }
}

export default ApiError;
