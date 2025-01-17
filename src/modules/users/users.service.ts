import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRegistrationDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { genSalt, hash } from 'bcryptjs';
import { NativeUserRepository } from '../../repository/user.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(NativeUserRepository)
    private nativeUserRepository: NativeUserRepository, // 1.
  ) {}

  async registerUser(userRegistrationDto: UserRegistrationDto) {
    if (
      userRegistrationDto.userPassword !== userRegistrationDto.matchingPassword
    ) {
      throw new UnauthorizedException('Password does not match');
    }
    const user = new User();
    user.user_email = userRegistrationDto.userEmail;
    user.user_password = userRegistrationDto.userPassword;
    user.user_name = userRegistrationDto.userName;

    const salt = await genSalt(); // 2.
    user.user_password = await hash(userRegistrationDto.userPassword, salt); // 3
    return this.nativeUserRepository.save(user);
  }
  async findOne(email: string): Promise<User> {
    return this.nativeUserRepository.findOne({ where: { user_email: email } });
  }
  async findOneById(id: string): Promise<User> {
    return this.nativeUserRepository.findOne({ where: { user_id: id } });
  }
  async findOneByEmail(email: string): Promise<User> {
    return this.nativeUserRepository.findOne({ where: { user_email: email } });
  }
  async getUserByTourId(tourId: number): Promise<User> {
    return this.nativeUserRepository.getUserByTourId(tourId).then((res) => {
      return res[0];
    });
  }
}
