import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import FavouriteImageEntity from '@entities/favourite-image.entity';
import ImageEntity from '@entities/image.entity';
import UserEntity from '@entities/user.entity';

import { IResponse } from '@typings/common';
import { ImageFilter } from '@typings/image';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FavouriteImageEntity)
    private readonly favouriteRepository: Repository<FavouriteImageEntity>,
  ) {}

  /**
   * To get the list of images available
   * @param filter - an object having pagination and filter details
   */
  async getImages(
    filter: ImageFilter,
    user: any,
  ): Promise<IResponse<ImageEntity[]>> {
    try {
      const {
        page = 1,
        page_size = 10,
        sort_by = 'author',
        sort_order = 'ASC',
      } = filter;
      // const [result, count] = await this.imageRepository.findAndCount({
      //   order: { [sort_by]: sort_order },
      //   skip: (page - 1) * page_size,
      //   take: page_size,
      // });
      const { id } = user;
      const [result, count] = await this.imageRepository
        .createQueryBuilder('images')
        .leftJoinAndSelect(
          'images.favourites',
          'user_favourite_images',
          `user_favourite_images.image_id=images.id and user_favourite_images.is_deleted=false and user_favourite_images.user_id = '${id}'`,
        )
        .select([
          'images.author',
          'images.height',
          'images.width',
          'images.download_url',
          'images.url',
          'images.id',
        ])
        .addSelect('user_favourite_images.id')
        .orderBy(sort_by, sort_order)
        .offset((page - 1) * page_size)
        .limit(page_size)
        .getManyAndCount();

      return {
        data: result.map((image: any) => {
          image.is_favourite = !!image.favourites;
          delete image.favourites;
          return image;
        }),
        pagination: { total: count, page, page_size },
      };
    } catch (e) {
      throw new HttpException(e, 500);
    }
  }

  /**
   * To get the list of favourite images of the user
   * @param user - a user of which images are being fetched
   */
  async getFavouriteImages(filter: ImageFilter, user: any): Promise<any> {
    try {
      const { id } = user;
      const {
        page = 1,
        page_size = 10,
        sort_by = 'author',
        sort_order = 'ASC',
      } = filter;
      const [favouriteImages, count] = await this.favouriteRepository
        .createQueryBuilder('user_favourite_images')
        .leftJoinAndSelect('user_favourite_images.image', 'image')
        .select('user_favourite_images.id')
        .addSelect([
          'image.author',
          'image.height',
          'image.width',
          'image.download_url',
          'image.url',
          'image.id',
        ])
        .orderBy(sort_by, sort_order)
        .where('user_favourite_images.user_id = :id', { id })
        .offset((page - 1) * page_size)
        .limit(page_size)
        .getManyAndCount();
      return {
        data: favouriteImages.map((favourite) => favourite.image),
        pagination: { total: count, page, page_size },
      };
    } catch (e) {
      throw e;
    }
  }

  /**
   * Removes the image from favourite list
   * @param imageId - an ID of the image being removed from favourite list
   * @param user - an object user who is going to delete favourite image
   */
  async deleteFavouriteImaeg(imageId: string, user: any): Promise<boolean> {
    try {
      const image = await this.imageRepository.findOne({ id: imageId });
      if (!image) {
        throw new HttpException('Invalid image selected', 403);
      }
      const favourite = await this.favouriteRepository.update(
        { user_id: user.id, image_id: imageId },
        { is_deleted: true, deleted_at: new Date() },
      );
      if (!favourite) {
        throw new HttpException(
          'There was some problem, please try again',
          500,
        );
      }
      return true;
    } catch (e) {
      throw e;
    }
  }

  /**
   * To mark image as a favourite for given user
   * @param imageId - an ID of the image being marked as favourite
   * @param user - an object of the user who's logged in
   */
  async markImageAsFavourite(imageId: string, user: any): Promise<boolean> {
    try {
      const image = await this.imageRepository.findOne({ id: imageId });
      if (!image) {
        throw new HttpException('Invalid image selected', 403);
      }
      const existingFavourite = await this.favouriteRepository.findOne({
        user_id: user.id,
        image_id: imageId,
        is_deleted: false,
      });
      if (existingFavourite) {
        throw new HttpException('Image already marked as favourite', 403);
      }
      const favouriteEntity = this.favouriteRepository.create({
        image_id: image.id,
        user_id: user.id,
      });
      const favourite = await this.favouriteRepository.save(favouriteEntity);
      if (!favourite) {
        throw new HttpException(
          'There was some problem, please try again',
          500,
        );
      }
      return true;
    } catch (e) {
      throw e;
    }
  }
}
