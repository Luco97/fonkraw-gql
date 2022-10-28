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
  OneToMany,
} from 'typeorm';

import { UserModel } from '../user/user.model';
import { GenreModel } from '../genre/genre.model';
import { AuthorModel } from '../author/author.model';
import { LanguageModel } from '../language/language.model';
import { Field, ObjectType } from '@nestjs/graphql';
import { CommentModel } from '../comment/comment.model';

@Entity()
@ObjectType()
export class MangaModel {
  @Field(() => Number)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => String)
  @Column({ type: 'varchar' })
  title: string;

  @Field(() => Number)
  @Column({ type: 'int' })
  pages: number;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true })
  cover_url: string;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false })
  active: boolean;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp' }) deleted_at: Date;

  @Field(() => LanguageModel, { nullable: true })
  @ManyToOne(() => LanguageModel, (language) => language.manga)
  language: LanguageModel;

  @Field(() => AuthorModel)
  @ManyToMany(() => AuthorModel, (author) => author.mangas, { nullable: false })
  @JoinTable()
  authors: AuthorModel[];

  @Field(() => GenreModel, { nullable: true })
  @ManyToMany(() => GenreModel, (genre) => genre.mangas)
  @JoinTable()
  genres: GenreModel[];

  @ManyToMany(() => UserModel, (user) => user.mangas)
  users: UserModel[];

  @OneToMany(() => CommentModel, (comment) => comment.manga, { nullable: true })
  comments: CommentModel[];

  // Map's fields (fields created using things like loadRelationCountAndMap)
  @Field(() => Number, { nullable: true })
  favorites_user?: number;

  @Field(() => Number, { nullable: true })
  commentaries?: number;
}
