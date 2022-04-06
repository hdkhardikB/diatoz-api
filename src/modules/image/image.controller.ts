import { JwtAuthGuard } from '@modules/auth/guards/jwt.auth.gruad';
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MarkFavouriteDTO } from './dto/mark-favourite.dto';
import { ImageService } from './image.service';

@Controller('images')
export class ImageController {
  constructor(private imageService: ImageService) {}

  // To get all images
  @UseGuards(JwtAuthGuard)
  @Get('all')
  async getImages(@Req() req) {
    try {
      const { page, page_size, sort_by, sort_order } = req.query;
      return await this.imageService.getImages(
        {
          page,
          page_size,
          sort_by,
          sort_order,
        },
        req.user,
      );
    } catch (e) {
      throw e;
    }
  }

  // To get list of favourite images
  @UseGuards(JwtAuthGuard)
  @Get('favourites')
  async getFavouriteImages(@Req() req) {
    try {
      const { page, page_size, sort_by, sort_order } = req.query;
      return await this.imageService.getFavouriteImages(
        { page, page_size, sort_by, sort_order },
        req.user,
      );
    } catch (e) {
      throw e;
    }
  }

  // To mark it as favorite
  @UseGuards(JwtAuthGuard)
  @Post('favourite')
  async markImageFavourite(@Req() req, @Body() body: MarkFavouriteDTO) {
    try {
      const { image_id } = body;
      const { user } = req;
      return await this.imageService.markImageAsFavourite(image_id, user);
    } catch (e) {
      throw e;
    }
  }

  // To remove item from favorite
  @UseGuards(JwtAuthGuard)
  @Put('remove-favourite')
  async removeFavouriteImage(@Req() req, @Body() body: MarkFavouriteDTO) {
    try {
      const { image_id } = body;
      const { user } = req;
      return await this.imageService.deleteFavouriteImaeg(image_id, user);
    } catch (e) {}
  }
}
