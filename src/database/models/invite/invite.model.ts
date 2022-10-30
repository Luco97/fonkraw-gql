import { Field, ObjectType } from '@nestjs/graphql';

import {
  Column,
  Entity,
  OneToOne,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { MangaModel } from '../manga/manga.model';
import { AuthorModel } from '../author/author.model';

@Entity()
@ObjectType()
export class InviteModel {
  // id de siempre
  // estado de invitacion
  // from author (autor A)
  // to author (autor B) A != B
  // comentario
  @Field(() => Number)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false })
  status: boolean;

  @Field(() => String)
  @Column({ type: 'varchar', length: '300', nullable: true })
  comment: string;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Field(() => AuthorModel)
  @ManyToOne(() => AuthorModel, { nullable: false })
  from_author: AuthorModel;

  @Field(() => AuthorModel)
  @ManyToOne(() => AuthorModel, { nullable: false })
  to_author: AuthorModel;

  @OneToOne(() => MangaModel, { nullable: false })
  @JoinColumn()
  manga: MangaModel;
}
