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

@Injectable()
export class FilmService {
  constructor(@Inject(FilmModel) private model: FilmModel) {}

  /* admin api */
  public async addFilm(dto: FilmReqDto): Promise<SuccessInsert> {
    const film = await this.model.findByNameAndYear(dto.name, dto.year); // TODO maybe it can move to function?
    if (film) throw new InsertDuplicate();

    return this.model.insertFilm(dto).then((v) => SuccessInsert.get());
  }

  public async addFileFromFile(
    str: string,
  ): Promise<AddFilmFromFileResDto | SuccessInsert> {
    if (!str) return SuccessInsert.get();

    const getVal = (item: string): string => {
      const val = item.split(':')[1];
      return val ? val.trim() : '';
    };

    const notAdd: string[] = [];

    const items = str.split('\n\n');
    for (const item of items) {
      const fields = item.split('\n');
      if (fields.length !== 4) {
        notAdd.push(fields[0]);
      } else {
        const dto = new FilmReqDto();
        dto.name = getVal(fields[0]);
        dto.year = Number.parseInt(getVal(fields[1])); // Doesn't validate this param
        dto.format = EFilmFormat[getVal(fields[2]).toUpperCase()]; // Doesn't validate this param
        dto.actors = getVal(fields[3]);

        if (dto.actors && dto.format && dto.name && dto.year) {
          const isAdd = await this.addFilm(dto).catch((er) => er);
          if (isAdd.status === 403) notAdd.push(fields[0]);
        } else {
          notAdd.push(fields[0]);
        }
      }
    }
    return notAdd.length
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
}
