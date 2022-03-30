import { Entity, Column, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';

import SBaseEntity from './base.entity';

@Entity('users')
export default class UserEntity extends SBaseEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @BeforeInsert() async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
