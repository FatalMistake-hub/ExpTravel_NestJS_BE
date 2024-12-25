import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRegistrationDto } from './dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

// import { ChangePasswordResponse } from './response/change-password.response';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    status: 201,
    description: 'It will return the user in the response',
  })
  async registerUser(
    @Body() userRegistrationDto: UserRegistrationDto,
  ): Promise<any> {
    return this.userService.registerUser(userRegistrationDto);
  }

  // @Get('confirm-account')
  // async confirmUserAccount(
  //   @Query('token') confirmationToken: string,
  // ): Promise<any> {
  //   return this.userService.confirmEmail(confirmationToken);
  // }

  // @Put('change-password')
  // async changePassword(@Body() userPasswordDto: UserPasswordDto): Promise<ChangePasswordResponse> {
  //   const errors = this.userService.validatePasswordChange(userPasswordDto);
  //   if (errors) {
  //     throw new HttpException(errors, HttpStatus.BAD_REQUEST);
  //   }
  //   await this.userService.changePassword(userPasswordDto);
  //   return {
  //     message: 'Change Password Success',
  //     status_code: HttpStatus.OK.toString(),
  //   };
  // }
}
