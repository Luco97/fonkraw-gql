import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserModel } from '../user/user.model';
import { Field, ObjectType } from '@nestjs/graphql';

import { MangaModel } from '../manga/manga.model';

@Entity({ orderBy: { created_at: 'ASC' } })
@ObjectType()
export class CommentModel {
  @Field(() => Number)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => String)
  @Column({
    length: '1000',
    type: 'varchar',
    nullable: false,
  })
  comment: string;

  @Field(() => Date)
  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at: Date;

  @ManyToOne(() => MangaModel, (manga) => manga.comments, { nullable: false })
  manga: MangaModel;

  @ManyToOne(() => UserModel, { nullable: false })
  user: UserModel;
}
