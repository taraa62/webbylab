import { EFilmFormat } from './film.dto';

export interface IFilmEntity {
  id: number;
  name: string;
  year: number;
  format: EFilmFormat;
  actors: string;
  createdAt: Date;
}

export type IFilmList = Omit<IFilmEntity, 'format' | 'actors' | 'createdAt'>;
