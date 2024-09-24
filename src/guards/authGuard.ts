import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';

import {
  AuthHeaderNotFoundException,
  InvalidAccessTokenException,
  InvalidTokenFormatException,
} from '@common/errors/authExceptions';
import TokenService from '@common/token/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}

  canActivate = async (context: ExecutionContext): Promise<boolean> => {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new AuthHeaderNotFoundException();
    }
    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new InvalidTokenFormatException();
    }

    try {
      request.user = await this.tokenService.validateAccessToken(token);
      return true;
    } catch (err) {
      throw new InvalidAccessTokenException();
    }
  };
}
