import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { FilmService } from './film.service';
import { IFilmList } from './film';
import { FilmResDto } from './film.dto';
import { EFindLikeType, EmptySearch, FindDto } from './find.dto';

@ApiTags('Find - user panel')
@Controller('find')
export class FindFilmController {
  constructor(private service: FilmService) {}

  @Get('/list')
  @ApiCreatedResponse({
    status: 200,
    description: 'get all films',
    type: FilmResDto,
    isArray: true,
  })
  public getFilms(): Promise<IFilmList[] | EmptySearch> {
    return this.service
      .getFilms()
      .then((data) => (data.length ? data : new EmptySearch()));
  }

  @Get(':id')
  @ApiCreatedResponse({
    status: 200,
    description: 'info of film',
    type: FilmResDto,
  })
  public getFilmInfo(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FilmResDto> {
    return this.service.getFilmInfo(id);
  }

  @Get('/name/:name')
  @ApiCreatedResponse({
    status: 200,
    description: 'find film by name',
    type: FilmResDto,
  })
  public getFilmByName(
    @Param('name') name: string,
  ): Promise<FilmResDto[] | IFilmList[] | EmptySearch> {
    if (!name) throw new BadRequestException();

    const dto = new FindDto();
    dto.name = name;
    dto.like = EFindLikeType.LIKE;
    return this.service
      .findFilms(dto)
      .then((data) => (data.length ? data : new EmptySearch()));
  }

  @Get('/actor/:actor')
  @ApiCreatedResponse({
    status: 200,
    description: 'find film by actor',
    type: FilmResDto,
  })
  public getFilmByActor(
    @Param('actor') actor: string,
  ): Promise<FilmResDto[] | IFilmList[] | EmptySearch> {
    if (!actor) throw new BadRequestException();

    const dto = new FindDto();
    dto.actors = actor;
    dto.like = EFindLikeType.LIKE;
    return this.service
      .findFilms(dto)
      .then((data) => (data.length ? data : new EmptySearch()));
  }

  @Get('/')
  @ApiCreatedResponse({
    status: 200,
    description: 'general search',
    type: FilmResDto,
    isArray: true,
  })
  public findFilm(@Query() opt: FindDto): Promise<FilmResDto[] | EmptySearch> {
    return this.service
      .findFilms(opt)
      .then((data) => (data.length ? data : new EmptySearch()));
  }
}
