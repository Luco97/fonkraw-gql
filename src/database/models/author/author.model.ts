import { Field, ObjectType } from '@nestjs/graphql';

import {
  Entity,
  Column,
  OneToOne,
  OneToMany,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserModel } from '../user/user.model';
import { MangaModel } from '../manga/manga.model';
import { InviteModel } from '../invite/invite.model';

@Entity()
@ObjectType()
export class AuthorModel {
  @Field(() => Number)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => String)
  @Column({ type: 'varchar' })
  alias: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: '1500' })
  description: string;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamp' })
  create_at: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamp' })
  update_at: Date;

  @DeleteDateColumn({ type: 'timestamp' }) delete_at: Date;

  // @OneToMany(() => InviteModel, (request) => request.from_author)
  // send_invites: InviteModel[];

  @OneToMany(() => InviteModel, (request) => request.to_author)
  invites: InviteModel[];

  @OneToOne(() => UserModel, (user) => user.author_profile)
  user: UserModel;

  @ManyToMany(() => MangaModel, (manga) => manga.authors)
  mangas: MangaModel[];

  @OneToMany(() => MangaModel, (manga) => manga.creator)
  init_mangas: MangaModel[];

  // Map's fields (fields created using things like loadRelationCountAndMap)
  @Field(() => Number, { nullable: true })
  mangas_count?: number;
}
