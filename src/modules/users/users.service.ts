import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRegistrationDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { genSalt, hash } from 'bcryptjs';
import { NativeUserRepository } from './repository/user.repository';

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
    user.userEmail = userRegistrationDto.userEmail;
    user.userPassword = userRegistrationDto.userPassword;
    user.userName = userRegistrationDto.userName;

    const salt = await genSalt(); // 2.
    user.userPassword = await hash(userRegistrationDto.userPassword, salt); // 3
    return this.nativeUserRepository.save(user);
  }
  async findOne(email: string): Promise<User> {
    return this.nativeUserRepository.findOne({ where: { userEmail: email } });
  }
  async findOneById(id: string): Promise<User> {
    return this.nativeUserRepository.findOne({ where: { userId: id } });
  }
  async findOneByEmail(email: string): Promise<User> {
    return this.nativeUserRepository.findOne({ where: { userEmail: email } });
  }
  async getUserByTourId(tourId: number): Promise<User> {
    return this.nativeUserRepository.getUserByTourId(tourId).then((res) => {
      return res[0];
    });
  }
}
