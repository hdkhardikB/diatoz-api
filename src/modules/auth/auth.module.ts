import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';

import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';

import UserEntity from '@entities/user.entity';
import { UserService } from '@modules/user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('keys.secret'),
          signOptions: { expiresIn: '240m' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [JwtStrategy, LocalStrategy, UserService, AuthService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
