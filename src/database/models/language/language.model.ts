import { Field, ObjectType } from '@nestjs/graphql';

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { MangaModel } from '../manga/manga.model';

@Entity()
@ObjectType()
export class LanguageModel {
  @Field(() => Number)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => String)
  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
  })
  language: string;

  @Field(() => String)
  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
  })
  country: string;

  @Field(() => String)
  @Column({
    type: 'varchar',
    nullable: true,
  })
  country_flag: string;

  @OneToMany(() => MangaModel, (manga) => manga.language)
  manga: MangaModel[];
}
