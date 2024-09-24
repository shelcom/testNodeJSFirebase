import {Module} from '@nestjs/common';
import {UserController} from './user.controller';
import {PasswordService} from '@common/password/password.service';
import UserRepository from '@domains/user/user.repository';
import {UserService} from './user.service';
import PasswordRepository from '@domains/user/password.repository';
import {SharedModule} from 'shared.module';

@Module({
  imports: [SharedModule],
  controllers: [UserController],
  providers: [UserService, PasswordService, PasswordRepository, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
