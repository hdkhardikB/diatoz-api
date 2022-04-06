import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import ImageEntity from '@entities/image.entity';

import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import FavouriteImageEntity from '@entities/favourite-image.entity';
import UserEntity from '@entities/user.entity';

@Module({
  providers: [ImageService],
  imports: [
    TypeOrmModule.forFeature([ImageEntity, UserEntity, FavouriteImageEntity]),
  ],
  controllers: [ImageController],
})
export class ImageModule {}
