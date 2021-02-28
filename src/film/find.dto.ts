import { ApiProperty } from '@nestjs/swagger';
import { EFilmFormat } from './film.dto';

export enum EFindJoinType {
  'AND' = 'AND',
  'OR' = 'OR',
}

export enum EFindLikeType {
  'EQUAL' = 'EQUAL',
  'LIKE' = 'LIKE',
  'LIKE_LEFT' = 'LIKE_LEFT',
  'LIKE_RIGHT' = 'LIKE_RIGHT',
}
export enum EFindSortType {
  'ASC' = 'ASC',
  'DESC' = 'DESC',
}

export class FindDto {
  @ApiProperty({
    type: EFindJoinType,
    enum: EFindJoinType,
    required: true,
    description: 'sql join type',
    default: EFindJoinType.AND,
  })
  readonly join: EFindJoinType;

  @ApiProperty({
    type: EFindLikeType,
    enum: EFindLikeType,
    required: true,
    description: 'text find type',
    default: EFindLikeType.LIKE,
  })
  like: EFindLikeType;

  @ApiProperty({
    type: EFindSortType,
    enum: EFindSortType,
    required: false,
    description: 'sort',
  })
  sort: EFindSortType;

  @ApiProperty({
    type: String,
    required: false,
    description: 'film name',
  })
  name: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'actors (split by ",")',
  })
  actors: string;

  @ApiProperty({
    type: Number,
    required: false,
    description: 'year',
  })
  readonly year: number;

  @ApiProperty({
    type: EFilmFormat,
    enum: EFilmFormat,
    required: false,
    description: 'format',
  })
  readonly format: EFilmFormat;
}
