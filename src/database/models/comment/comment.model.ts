import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
}
