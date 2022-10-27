import { Field, ObjectType } from '@nestjs/graphql';

import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { MangaModel } from '../manga/manga.model';

@Entity()
@ObjectType()
export class GenreModel {
  @Field(() => Number)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => String)
  @Column({ type: 'varchar' })
  name: string;

  @Field(() => String)
  @Column({ type: 'varchar', nullable: true })
  description: string;

  @ManyToMany(() => MangaModel, (manga) => manga.genres)
  mangas: MangaModel[];

  // Map's fields (fields created using things like loadRelationCountAndMap)
  @Field(() => Number, { nullable: true })
  mangas_count?: number;
}
