import { IsEnum, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsYear } from '../utils/year.validate';
import { parseInt, trim } from '../utils/transform';
import { IFilmEntity } from './film';

export enum EFilmFormat {
  'VHS' = 'VHS',
  'DVD' = 'DVD',
  'BLU-RAY' = 'BLU-RAY',
}

export class FilmReqDto {
  @ApiProperty({ type: String, description: 'name', example: 'Godzilla' })
  @Transform(trim)
  @IsString()
  @MaxLength(500)
  public name: string;

  @ApiProperty({ type: String, description: 'year', example: '2010' })
  @Transform(parseInt)
  @IsYear()
  public year: number;

  @ApiProperty({
    type: EFilmFormat,
    enum: EFilmFormat,
    description: 'format',
    example: 'DVD',
  })
  @Transform((value) => {
    return EFilmFormat[value.value];
  })
  @IsEnum(EFilmFormat)
  public format: EFilmFormat;

  @ApiProperty({
    type: String,
    description: 'actors',
    example: 'Mel Brooks, Clevon Little',
  })
  @Transform(trim)
  @IsString()
  @MaxLength(2000)
  public actors: string;
}

export class FilmResDto extends FilmReqDto implements IFilmEntity {
  @ApiProperty({
    type: Number,
  })
  public id: number;

  @ApiProperty({
    type: Date,
  })
  public createdAt: Date;
}

export class AddFileDto {
  @ApiProperty({
    type: String,
    required: false,
    format: 'binary',
    name: 'file',
    description: 'file',
  })
  public file: any;
}

export class AddFilmFromFileResDto {
  @ApiProperty({
    type: String,
    isArray: true,
    required: true,
    description: 'title of films that did not push to db',
  })
  notAddNames: string[];
}
