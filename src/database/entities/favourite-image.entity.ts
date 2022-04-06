import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';

import SBaseEntity from './base.entity';
import ImageEntity from './image.entity';
import UserEntity from './user.entity';

@Entity('user_favourite_images')
export default class FavouriteImageEntity extends SBaseEntity {
  @Column()
  user_id: string;

  @Column()
  image_id: string;

  @ManyToOne(() => ImageEntity, (image) => image)
  @JoinColumn({ name: 'image_id', referencedColumnName: 'id' })
  image: ImageEntity;

  @ManyToOne(() => UserEntity, (user) => user)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;
}
