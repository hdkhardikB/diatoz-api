import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

const dbConfigs = (configService: ConfigService) => {
  let coreConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: configService.get('database.host'),
    port: configService.get('database.port'),
    username: configService.get('database.username'),
    password: configService.get('database.password'),
    database: configService.get('database.db_name'),
    synchronize: false,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  };
  switch (process.env.APP_ENV) {
    case 'stage':
    case 'prod': {
      coreConfig = {
        ...coreConfig,
        // ... Any additional configuration related to envrionment
      };
      break;
    }
    default: {
      coreConfig = { ...coreConfig };
      break;
    }
  }
  return coreConfig;
};

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: dbConfigs,
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
