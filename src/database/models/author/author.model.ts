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
export class AuthorModel {
  @PrimaryGeneratedColumn('increment') id: number;

  @Column({ type: 'varchar' }) alias: string;

  @Column({ type: 'varchar', length: '1500' }) description: string;

  @CreateDateColumn({ type: 'timestamp' }) create_at: Date;

  @UpdateDateColumn({ type: 'timestamp' }) update_at: Date;

  @DeleteDateColumn({ type: 'timestamp' }) delete_at: Date;

  @OneToMany(() => InviteModel, (request) => request.to_author)
  invites: InviteModel[];

  @OneToOne(() => UserModel, (user) => user.author_profile)
  user: UserModel;

  @ManyToMany(() => MangaModel)
  mangas: MangaModel[];
}
