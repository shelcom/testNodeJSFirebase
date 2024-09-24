import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {AuthGuard} from '@guards/authGuard';
import {RefreshTokenDto} from './dto/refreshToken.dto';
import {AuthService} from './auth.service';
import {CreateUserDto} from './dto/createUser.dto';
import {LoginUserDto} from './dto/loginUser.dto';
import {UserDomainModel} from '@domains/models/user.model';
import {User} from '@api/user/user.decorator';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/register')
  @ApiOperation({summary: 'Create user'})
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({status: 403, description: 'Forbidden.'})
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post('auth/login')
  @HttpCode(200)
  @ApiOperation({summary: 'Login user'})
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully login.',
  })
  @ApiResponse({status: 403, description: 'Forbidden.'})
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.login(loginUserDto);
  }

  @UseGuards(AuthGuard)
  @Post('auth/refresh')
  @HttpCode(200)
  @ApiOperation({summary: 'Refresh token'})
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully refresh tokens.',
  })
  @ApiResponse({status: 403, description: 'Forbidden.'})
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @User() user: UserDomainModel,
  ) {
    return await this.authService.refresh(
      refreshTokenDto.refreshToken,
      user.id,
    );
  }

  @UseGuards(AuthGuard)
  @Get('auth/test')
  @HttpCode(200)
  @ApiOperation({summary: 'Test token'})
  @ApiResponse({
    status: 200,
    description: 'You tested token',
  })
  @ApiResponse({status: 403, description: 'Forbidden.'})
  async testTokens() {
    return {message: 'Evrething is good'};
  }
}
