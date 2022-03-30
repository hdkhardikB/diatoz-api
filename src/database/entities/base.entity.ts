import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

export default abstract class SBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    default: false,
  })
  is_deleted: boolean;

  @Column({
    default: true,
  })
  is_active: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone' })
  deleted_at: Date;
}
