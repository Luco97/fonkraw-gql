import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { MangaModel } from '../manga/manga.model';

@Entity()
export class GenreModel {
  @PrimaryGeneratedColumn('increment') id: number;

  @Column({ type: 'varchar' }) name: string;

  @Column({ type: 'varchar' }) description: string;

  @ManyToMany(() => MangaModel, (manga) => manga.genres)
  mangas: MangaModel[];
}
