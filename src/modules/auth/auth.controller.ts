import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorator/public.decorator';
import { AuthRefreshTokenService } from './auth-refresh-token.service';
import { AuthService } from './auth.service';
import { JwtRefreshRequest, JwtResquest } from './dto/jwt.dto';
import { JwtService } from '@nestjs/jwt';
import { Response, Request as ExpressRequest } from 'express';
import { JwtRefreshAuthGuard } from './guard/jwt-refresh-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private authRefreshTokenService: AuthRefreshTokenService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'It will give you the access_token in the response',
  })
  login(
    @Body()
    jwtResquest: JwtResquest,
  ) {
    return this.authService.login(jwtResquest);
  }

  @ApiBearerAuth()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh-tokens/')
  refreshTokens(@Request() req: ExpressRequest) {
    console.log(req.user);
    if (!req.user) {
      throw new InternalServerErrorException();
    }
    return this.authRefreshTokenService.generateTokenPair(
      (req.user as any).attributes,
      req.headers.authorization?.split(' ')[1],
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(
    @Request() req: ExpressRequest,
    @Body() jwtRefreshRequest: JwtRefreshRequest,
  ) {
    console.log(req.user);
    if (!req.user) {
      throw new InternalServerErrorException();
    }
    return this.authRefreshTokenService.deleteRefreshToken(
      (req.user as any),
      jwtRefreshRequest.refreshToken,
    );
  }
  
}
