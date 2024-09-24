import {ThrottlerModule} from '@nestjs/throttler';
import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';

import {AuthModule} from '@api/auth/auth.module';
import {UserModule} from '@api/user/user.module';
import {DatabaseModule} from '@infrastructure/database/database.module';
import {SharedModule} from 'shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/.env.${process.env.NODE_ENV || 'development'}`,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get('THROTTLE_TTL'),
          limit: config.get('THROTTLE_LIMIT'),
        },
      ],
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    SharedModule,
  ],
})
export class AppModule {}
