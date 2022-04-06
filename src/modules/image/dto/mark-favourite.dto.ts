import { IsNotEmpty } from 'class-validator';

export class MarkFavouriteDTO {
  @IsNotEmpty() image_id: string;
}
