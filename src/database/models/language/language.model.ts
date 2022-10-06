import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LanguageModel {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
  })
  language: string;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
  })
  country: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  country_flag: string;
}
