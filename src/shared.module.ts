import {Module, Global} from '@nestjs/common';
import {JwtService} from '@common/jwt/jwt.service';
import {ValidationService} from '@common/validation/validation.service';
import TokenService from '@common/token/token.service';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {JwtModule} from '@nestjs/jwt';
import TokenRepository from '@domains/auth/token.repository';
import {LoggerService} from '@common/logger/logger.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get<string | number>('JWT_EXPIRES_IN'),
        },
      }),
    }),
  ],
  providers: [
    JwtService,
    ValidationService,
    TokenService,
    TokenRepository,
    LoggerService,
  ],
  exports: [
    JwtService,
    ValidationService,
    TokenService,
    TokenRepository,
    JwtModule,
    LoggerService,
  ],
})
export class SharedModule {}
