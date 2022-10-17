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
export class InviteModel {
  // id de siempre
  // estado de invitacion
  // from author (autor A)
  // to author (autor B) A != B
  // comentario
  @PrimaryGeneratedColumn('increment') id: number;

  @Column({ type: 'boolean', default: false }) status: boolean;

  @Column({ type: 'varchar', length: '300', nullable: true }) comment: string;

  @CreateDateColumn({ type: 'timestamp' }) created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' }) updated_at: Date;

  @OneToOne(() => AuthorModel, { nullable: false })
  @JoinColumn()
  from_author: AuthorModel;

  @OneToOne(() => MangaModel, { nullable: false })
  @JoinColumn()
  manga: MangaModel;

  @ManyToOne(() => AuthorModel, { nullable: false })
  to_author: AuthorModel;
}
