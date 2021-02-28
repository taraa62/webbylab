import { Module } from '@nestjs/common';
import { FilmController } from './film.controller';
import { FilmService } from './film.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmEntity } from './film.entity';
import { FilmModel } from './film.model';
import { FindFilmController } from './find-film.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FilmEntity])],
  controllers: [FilmController, FindFilmController],
  providers: [FilmModel, FilmService],
})
export class FilmModule {}
