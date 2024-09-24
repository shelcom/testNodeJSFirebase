import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {AuthGuard} from '@guards/authGuard';
import {UserService} from './user.service';
import {ChangePasswordDto} from './dto/changePassword.dto';
import {RecoverPasswordDto} from './dto/recoverPassword.dto';
import {UserDomainModel} from '@domains/models/user.model';
import {User} from './user.decorator';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Patch('users/{id}/change-password')
  @HttpCode(200)
  @ApiOperation({summary: 'Change user password'})
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully changed paswword.',
  })
  @ApiResponse({status: 403, description: 'Forbidden.'})
  async password(
    @Body() changePasswordDto: ChangePasswordDto,
    @User() user: UserDomainModel,
  ) {
    await this.userService.changePassword(changePasswordDto, user.id);

    return {message: 'Your password successfully changed'};
  }

  @Post('users/{id}/recover-password')
  @HttpCode(200)
  @ApiOperation({summary: 'Recover password'})
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully send recover password.',
  })
  @ApiResponse({status: 403, description: 'Forbidden.'})
  async recover(@Body() recoverPasswordDto: RecoverPasswordDto) {
    const forgotPasswordToken = await this.userService.recoverPassword(
      recoverPasswordDto.email,
    );
    return {message: `Forgot password token: ${forgotPasswordToken}`};
  }

  @UseGuards(AuthGuard)
  @Get('users/{id}/logout')
  @HttpCode(200)
  @ApiOperation({summary: 'Logout user'})
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logout.',
  })
  @ApiResponse({status: 403, description: 'Forbidden.'})
  async logout(@User() user: UserDomainModel) {
    await this.userService.logout(user.id);
    return {message: 'You succesfully logout'};
  }
}
