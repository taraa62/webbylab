import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { ConfigService } from '@nestjs/config';

export const opt = (configService: ConfigService): TypeOrmModuleOptions => {
  const conf: TypeOrmModuleOptions = {
    type: 'postgres',
    host: configService.get('DATABASE_HOST'),
    port: 5432,
    username: configService.get('DATABASE_USER'),
    password: configService.get('DATABASE_PASSWORD'),
    database: configService.get('DATABASE_NAME'),
    synchronize: true,
    dropSchema: false,
    logging: true,
    // ssl:true,

    entities: [
      configService.get('NODE_ENV') !== 'test'
        ? 'dist/**/*.entity.js'
        : './src/**/**.entity.ts',
    ],
    cli: {
      entitiesDir: './src/**/*',
      migrationsDir: 'src/migration',
      subscribersDir: 'src/subscriber',
    },
    migrations: [],
    subscribers: [],
  };
  console.log(conf);
  return conf;
};
