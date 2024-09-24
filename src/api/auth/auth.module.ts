import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {DatabaseSource} from '@infrastructure/database/data-source';
import {AuthGuard} from '@guards/authGuard';
import {AuthService} from './auth.service';
import AuthRepository from '@domains/auth/auth.repository';
import {PasswordService} from '@common/password/password.service';
import PasswordRepository from '@domains/user/password.repository';
import {SharedModule} from 'shared.module';

@Module({
  imports: [SharedModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    PasswordService,
    PasswordRepository,
    DatabaseSource,
    AuthGuard,
  ],
  exports: [AuthService, AuthRepository],
})
export class AuthModule {}
