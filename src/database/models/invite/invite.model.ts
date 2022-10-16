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

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' }) updated_at: Date;

  @OneToOne(() => AuthorModel)
  @JoinColumn()
  from_author: AuthorModel;

  @ManyToOne(() => AuthorModel)
  to_author: AuthorModel;
}
