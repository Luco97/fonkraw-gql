import { Field, ObjectType } from '@nestjs/graphql';

import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserModel } from '../user/user.model';

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

  @Field(() => UserModel, { nullable: false })
  @ManyToOne(() => UserModel, { nullable: false })
  user: UserModel;

  @Field(() => Boolean, { defaultValue: false })
  deletable: boolean;
}
