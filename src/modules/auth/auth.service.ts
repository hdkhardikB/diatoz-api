import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { CreateUserDTO } from './dto/create.user.dto';
import { LoginUserDTO } from './dto/login.user.dto';
import { RegistrationStatus } from './interfaces/registration';
import { UserService } from '@modules/user/user.service';
import UserEntity from '@entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  /**
   * To create login request
   * @param loginUserDto - an object having user's credentials
   */
  async login(loginUserDto: LoginUserDTO): Promise<Record<string, any>> {
    // find user in db
    const user = await this.userService.findByLogin(loginUserDto);

    // generate and sign token
    const token = this.jwtService.sign({ email: user.email });

    return {
      email: user.email,
      access_token: token,
    };
  }

  /**
   * To validate user who's being logged in.
   * @param payload - an object having email and password to be compared.
   */
  async validateUser(payload: {
    email: string;
    password: string;
  }): Promise<UserEntity> {
    const user = await this.userService.findByPayload(payload);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  /**
   * Registers the user into system
   * @param userDto - an object having user information
   */
  async register(userDto: CreateUserDTO): Promise<RegistrationStatus> {
    let user;
    try {
      const { id, email, name } = await this.userService.create(userDto);

      user = { id, email, name };
      return user;
    } catch (err) {
      throw err;
    }
  }
}
