import * as bcrypt from 'bcrypt';

import UserEntity from '@entities/user.entity';
import { CreateUserDTO } from '@modules/auth/dto/create.user.dto';
import { LoginUserDTO } from '@modules/auth/dto/login.user.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * To compare password sent in request and present in system
   * @param userPassword - user's password passed in request
   * @param currentPassword - an actual password stored in DB
   */
  private comparePasswords = async (
    userPassword: string,
    currentPassword: string,
  ) => {
    return await bcrypt.compare(currentPassword, userPassword);
  };

  /**
   * Find the user by the user_name payload
   * @param param - an object having email
   */
  async findByPayload({ email }: any): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  /**
   * Find user based on credentials
   * @param param - object with credentials
   */
  async findByLogin({ email, password }: LoginUserDTO): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // compare passwords
    const areEqual = await this.comparePasswords(user.password, password);

    if (!areEqual) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    delete user.password;
    return user;
  }

  /**
   * To store a user information in DB
   * @param userDto - an object of user type having user info to be created
   */
  async create(memberDto: CreateUserDTO): Promise<UserEntity> {
    try {
      const { password, email, name } = memberDto;

      // check if the member exists in the db
      const userAlreadyExists = await this.userRepository.findOne({
        where: { email },
      });
      if (userAlreadyExists) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }
      const userEntity = this.userRepository.create({
        password,
        email,
        name,
      });
      const user = await this.userRepository.save(userEntity);
      return user;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
