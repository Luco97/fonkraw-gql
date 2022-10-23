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
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class MangaModel {
  @Field(() => Number)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar' }) title: string;

  @Column({ type: 'int' }) pages: number;

  @Column({ type: 'varchar' }) cover_url: string;

  @Field(() => Boolean)
  @Column({ type: 'boolean' })
  active: boolean;

  @CreateDateColumn({ type: 'timestamp' }) created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' }) updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp' }) deleted_at: Date;

  @ManyToOne(() => LanguageModel, (language) => language.manga)
  language: LanguageModel;

  @ManyToMany(() => AuthorModel, (author) => author.mangas, { nullable: false })
  @JoinTable()
  authors: AuthorModel[];

  @ManyToMany(() => GenreModel, (genre) => genre.mangas)
  @JoinTable()
  genres: GenreModel[];

  @ManyToMany(() => UserModel, (user) => user.mangas)
  users: UserModel[];
}
