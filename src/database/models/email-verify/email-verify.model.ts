import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EmailVerifyModel {
  @PrimaryGeneratedColumn('uuid', {})
  uuid: string;

  @Column({
    default: false,
    nullable: false,
    // select: false,
  })
  activated: boolean;
}
