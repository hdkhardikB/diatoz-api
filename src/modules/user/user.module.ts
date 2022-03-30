import UserEntity from '@entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';

@Module({
  providers: [UserService],
  imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class UserModule {}
