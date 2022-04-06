import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';

import SBaseEntity from './base.entity';
import FavouriteImageEntity from './favourite-image.entity';

@Entity('images')
export default class ImageEntity extends SBaseEntity {
  @Column()
  author: string;

  @Column()
  width: number;

  @Column()
  height: number;

  @Column()
  url: string;

  @Column()
  download_url: string;

  @OneToOne(() => FavouriteImageEntity, (image) => image)
  @JoinColumn({ name: 'id', referencedColumnName: 'image_id' })
  favourites: FavouriteImageEntity;
}
