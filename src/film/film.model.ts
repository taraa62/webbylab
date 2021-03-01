import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { FilmEntity } from './film.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FilmReqDto } from './film.dto';
import { EFindJoinType, EFindLikeType, FindDto } from './find.dto';

@Injectable()
export class FilmModel {
  constructor(
    @InjectRepository(FilmEntity)
    private readonly repository: Repository<FilmEntity>,
  ) {}

  public insertFilm(dto: FilmReqDto) {
    return this.repository.insert(dto);
  }

  public findByNameAndYear(name: string, year: number) {
    return this.repository.findOne({
      where: {
        name,
        year,
      },
    });
  }

  public getFilm(id: number) {
    return this.repository.findOne({
      where: { id },
    });
  }

  public deleteFilm(id: number) {
    return this.repository.delete(id);
  }

  public getFilms() {
    return this.repository.find({
      // select: ['id', 'name', 'year', 'format'],
      order: {
        name: 'ASC',
      },
    });
  }

  public findFilms(opt: FindDto) {
    const select: SelectQueryBuilder<FilmEntity> = this.repository.createQueryBuilder();
    opt.join = opt.join ?? EFindJoinType.AND;
    const join = opt.join === EFindJoinType.OR ? 'orWhere' : 'andWhere';
    opt.like = opt.like ?? EFindLikeType.EQUAL;

    const addText = (
      param: string,
      val: string,
      like: EFindLikeType,
    ): string => {
      if (!val) return;
      val = val.trim();
      if (like === EFindLikeType.EQUAL) {
        return `${param} = '${val}'`;
      }
      switch (like) {
        case EFindLikeType.LIKE:
          return `upper(${param}) like upper('%${val}%')`;
        case EFindLikeType.LIKE_LEFT:
          return `upper(${param}) like upper('%${val}')`;
        case EFindLikeType.LIKE_RIGHT:
          return `upper(${param}) like upper('${val}%')`;
      }
      return '';
    };

    select.where({});
    if (opt.year) {
      select[join](`year=${opt.year}`);
      if (opt.sort) select.addOrderBy('year', opt.sort);
    }
    if (opt.name) {
      select[join](addText('name', opt.name, opt.like));
      if (opt.sort) select.addOrderBy('name', opt.sort);
    }
    if (opt.format) {
      select[join](addText('format', opt.format, EFindLikeType.EQUAL));
      if (opt.sort) select.addOrderBy('format', opt.sort);
    }

    if (opt.actors) {
      if (opt.actors.includes(',')) {
        const queries: string[] = [];
        const actors = opt.actors.split(',');
        actors.forEach((v) => {
          const add = addText('actors', v, opt.like);
          if (add) queries.push(add);
        });
        select[join](`(${queries.join(` ${opt.join} `)})`);
      } else {
        select[join](addText('actors', opt.actors, opt.like));
      }
      if (opt.sort) select.addOrderBy('actors', opt.sort);
    }

    if (!opt.name && !opt.year && opt.sort) {
      select.addOrderBy('name', opt.sort);
    }

    return select.getMany();
  }
}
