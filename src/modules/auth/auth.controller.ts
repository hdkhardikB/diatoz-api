import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/create.user.dto';
import { LoginUserDTO } from './dto/login.user.dto';
import { JwtAuthGuard } from './guards/jwt.auth.gruad';
import { LocalAuthGuard } from './guards/local.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // To login a user
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body(new ValidationPipe({ disableErrorMessages: true }))
    body: LoginUserDTO,
    @Res() res,
  ) {
    const auth = await this.authService.login(body);
    res.json(auth);
  }

  // To get profile detail
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getLoggedInUser(@Request() req) {
    const {
      user: { id, name, email },
    } = req;
    return { id, name, email };
  }

  // To register a user
  @Post('register')
  async register(
    @Body()
    createUserDto: CreateUserDTO,
  ) {
    return await this.authService.register(createUserDto);
  }
}
