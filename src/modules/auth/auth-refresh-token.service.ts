import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from './entity/refresh-token.entity';
import { User } from '../users/user.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AuthRefreshTokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(RefreshToken)
    private authRefreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async generateRefreshToken(
    authUserId: string,
    currentRefreshToken?: string,
    currentRefreshTokenExpiresAt?: Date,
  ) {
    const newRefreshToken = this.jwtService.sign(
      { sub: authUserId },
      {
        secret: this.configService.get('jwtRefreshSecret'),
        expiresIn: '30d',
      },
    );
    const { exp, iat } = await this.jwtService.verify(newRefreshToken, {
      secret: this.configService.get('jwtRefreshSecret'),
    });

    if (await this.verifyRefreshToken(currentRefreshToken)) {
      await this.authRefreshTokenRepository.update(
        {
          token: currentRefreshToken,
        },
        {
          isValid: false,
        },
      );
    }

    await this.authRefreshTokenRepository.insert({
      token: newRefreshToken,
      expireDate: new Date(exp * 1000),
      userId: authUserId,
    });

    return newRefreshToken;
  }

  async verifyRefreshToken(refreshToken?: string) {
    const token = refreshToken
      ? await this.authRefreshTokenRepository.findOne({
          where: {
            token: refreshToken,
          },
        })
      : null;
    if (!token && refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    if (!token && !refreshToken) {
      return false;
    }
    if (token?.expireDate < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }
    if (
      !this.jwtService.verify(token.token, {
        secret: this.configService.get('jwtRefreshSecret'),
      }) ||
      !token.isValid
    ) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return token;
  }
  async generateTokenPair(
    user: User,
    currentRefreshToken?: string,
    currentRefreshTokenExpiresAt?: Date,
  ) {
    const payload = { email: user.userEmail, sub: user.userId };

    return {
      accessToken: this.jwtService.sign(payload), // jwt module is configured in auth.module.ts for access token
      refreshToken: await this.generateRefreshToken(
        user.userId,
        currentRefreshToken,
        currentRefreshTokenExpiresAt,
      ),
    };
  }

  async deleteRefreshToken(user: User, refreshToken: string) {
    await this.authRefreshTokenRepository.delete({
      userId: user.userId,
    });
    return {
      message: 'Logout successful',
    };
  }

  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async clearExpiredRefreshTokens() {
    console.log('Clearing expired refresh tokens', new Date().toISOString());
    await this.authRefreshTokenRepository.delete({
      expireDate: LessThanOrEqual(new Date()),
    });
    console.log('Expired refresh tokens cleared');
  }
}
