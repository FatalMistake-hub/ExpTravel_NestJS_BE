import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/modules/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt-strategy';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/modules/users/users.service';
import { AuthRefreshTokenService } from './auth-refresh-token.service';
import { RefreshToken } from './entity/refresh-token.entity';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { LocalStrategy } from './strategy/local-stategy';
// import { JwtRefreshStrategy } from './strategy/jwt-refresh-strategy';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([RefreshToken]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwtAccessSecret'),
        signOptions: {
          expiresIn: '30m',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    AuthRefreshTokenService,
  ],
  controllers: [AuthController],
  exports: [AuthService, AuthRefreshTokenService],
})
export class AuthModule {}
