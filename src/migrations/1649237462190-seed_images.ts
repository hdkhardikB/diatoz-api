import ImageEntity from '@entities/image.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import images from '../seeds/images';

export class seedImages1649237462190 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const imageEntities = images.map((image) =>
      queryRunner.manager.create<ImageEntity>(ImageEntity, {
        author: image.author,
        height: image.height,
        width: image.width,
        url: image.url,
        download_url: image.download_url,
      }),
    );
    await queryRunner.manager.save(imageEntities);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE * FROM images`);
  }
}
