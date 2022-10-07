import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserModel } from '../user/user.model';
import { MangaModel } from '../manga/manga.model';

@Entity()
export class CommentModel {
  @PrimaryGeneratedColumn({})
  id: number;

  @Column({
    length: '1000',
    type: 'varchar',
    nullable: false,
  })
  comment: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at: Date;

  @ManyToOne(() => MangaModel, { nullable: false })
  manga: MangaModel;

  @ManyToOne(() => UserModel, { nullable: false })
  user: UserModel;
}
