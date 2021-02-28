import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EFilmFormat } from './film.dto';
import { IFilmEntity } from './film';

@Entity({ name: 'film' })
export class FilmEntity extends BaseEntity implements IFilmEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  public id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 500,
    nullable: false,
  })
  public name: string;

  @Column({
    name: 'year',
    type: 'integer',
    nullable: false,
  })
  public year: number;

  @Column({
    name: 'format',
    type: 'enum',
    enum: EFilmFormat,
    nullable: false,
  })
  public format: EFilmFormat;

  @Column({
    name: 'actors',
    type: 'varchar',
    length: 2000,
    nullable: true,
  })
  public actors: string;

  @Column({ name: 'createdAt', type: 'timestamptz', default: 'now()' })
  public createdAt: Date;
}
