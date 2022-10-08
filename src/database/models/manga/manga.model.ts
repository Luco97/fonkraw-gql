import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  ManyToMany,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserModel } from '../user/user.model';
import { GenreModel } from '../genre/genre.model';
import { AuthorModel } from '../author/author.model';
import { LanguageModel } from '../language/language.model';

@Entity()
export class MangaModel {
  @PrimaryGeneratedColumn('increment') id: number;

  @Column({ type: 'varchar' }) title: string;

  @Column({ type: 'int' }) pages: number;

  @CreateDateColumn({ type: 'timestamp' }) created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' }) updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp' }) deleted_at: Date;

  @ManyToOne(() => LanguageModel, (language) => language.manga)
  language: LanguageModel;

  @ManyToMany(() => AuthorModel, (author) => author.mangas)
  @JoinTable()
  authors: AuthorModel[];

  @ManyToMany(() => GenreModel, (genre) => genre.mangas)
  @JoinTable()
  genres: GenreModel[];

  @ManyToMany(() => UserModel, (user) => user.mangas)
  users: UserModel[];
}
