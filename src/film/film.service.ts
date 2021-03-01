import { Inject, Injectable } from '@nestjs/common';
import {
  AddFilmFromFileResDto,
  EFilmFormat,
  FilmReqDto,
  FilmResDto,
} from './film.dto';
import { SuccessDelete, SuccessInsert } from '../app.dto';
import { FilmModel } from './film.model';
import { InsertDuplicate } from '../http-error/insert-duplicate';
import { FindDto } from './find.dto';
import { validate } from 'class-validator';

@Injectable()
export class FilmService {
  constructor(@Inject(FilmModel) private model: FilmModel) {}

  /* admin api */
  public async addFilm(dto: FilmReqDto): Promise<SuccessInsert> {
    const film = await this.model.findByNameAndYear(dto.name, dto.year); // TODO maybe it can move to function?
    if (film) throw new InsertDuplicate();
    dto.actors = this.getUniqueActors(dto.actors);
    return this.model.insertFilm(dto).then((v) => SuccessInsert.get());
  }

  public async addFilmFromFile(
    str: string,
  ): Promise<AddFilmFromFileResDto | SuccessInsert> {
    if (!str) return SuccessInsert.get();

    const getVal = (item: string): string => {
      const val = item.split(':')[1];
      return val ? val.trim() : '';
    };

    const notAdd: Record<string, any> = {};

    const items = str.split('\n\n');
    for (const item of items) {
      const fields = item.split('\n');
      if (fields.length !== 4) {
        // notAdd.push(fields[0]);
        notAdd[fields[0]] = 'Film does not have all fields.';
      } else {
        const dto = new FilmReqDto();
        dto.name = getVal(fields[0]);
        dto.year = Number.parseInt(getVal(fields[1])); // Doesn't validate this param
        dto.format = EFilmFormat[getVal(fields[2]).toUpperCase()]; // Doesn't validate this param
        dto.actors = this.getUniqueActors(getVal(fields[3]));

        const errors = await validate(dto);
        if (errors.length) {
          const err: Record<string, string[]> = {};
          errors.forEach((er) => {
            err[er.property] = Object.values(er.constraints);
          });
          notAdd[fields[0]] = err;
          // notAdd.push(`${fields[0]} => [${err}`);
        } else {
          const isAdd = await this.addFilm(dto).catch((er) => er);
          if (isAdd.status === 403) notAdd[fields[0]] = isAdd;
        }
      }
    }
    return Object.keys(notAdd).length
      ? <AddFilmFromFileResDto>{ notAddNames: notAdd }
      : SuccessInsert.get();
  }

  public deleteFilm(id: number): Promise<SuccessDelete> {
    return this.model.deleteFilm(id).then((v) => SuccessDelete.get());
  }

  /* User api */

  public getFilmInfo(id: number): Promise<FilmResDto> {
    return this.model.getFilm(id);
  }

  public getFilms(): Promise<FilmResDto[]> {
    return this.model.getFilms();
  }

  public findFilms(opt: FindDto): Promise<FilmResDto[]> {
    if (!opt.actors && !opt.format && !opt.name && !opt.year) {
      return this.getFilms();
    } else {
      return this.model.findFilms(opt);
    }
  }

  private getUniqueActors(str: string): string {
    const set = new Set<string>();
    str.split(',').forEach((v) => {
      v = v.trim();
      if (v) set.add(v);
    });
    const actors = Array.from(set).join(', ');
    return actors ? actors : 'There are no main characters in this film';
  }
}
