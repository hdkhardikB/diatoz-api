import {
  Entity,
  Column,
  BeforeInsert,
  OneToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

import SBaseEntity from './base.entity';
import FavouriteImageEntity from './favourite-image.entity';

@Entity('users')
export default class UserEntity extends SBaseEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => FavouriteImageEntity, (image) => image.user)
  @JoinColumn({ name: 'id', referencedColumnName: 'user_id' })
  @JoinTable({
    name: 'user_favourite_images',
    joinColumn: { name: 'id', referencedColumnName: 'user_id' },
    inverseJoinColumn: { name: 'image_id', referencedColumnName: 'id' },
  })
  favourite_images: FavouriteImageEntity[];

  @BeforeInsert() async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
