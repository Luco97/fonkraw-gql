import { Field, ObjectType } from '@nestjs/graphql';

import {
  Column,
  Entity,
  OneToOne,
  JoinTable,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { genSalt, hash } from 'bcrypt';

import { RoleModel } from '../role/role.model';
import { MangaModel } from '../manga/manga.model';
import { AuthorModel } from '../author/author.model';
import { EmailVerifyModel } from '../email-verify/email-verify.model';

@Entity()
@ObjectType()
export class UserModel {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => String)
  @Column({
    type: 'varchar',
    length: 40,
  })
  username: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true })
  image_url: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: '400', nullable: true })
  description: string;

  @Column({
    type: 'varchar',
    length: 60,
    select: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    select: false,
  })
  password: string;

  @Field(() => Date)
  @CreateDateColumn({
    type: 'timestamp',
    select: false,
  })
  createDate: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    select: false,
  })
  updateDate: Date;

  @ManyToMany(() => MangaModel, (manga) => manga.users, {
    nullable: true,
  })
  @JoinTable()
  mangas: MangaModel[];

  @ManyToOne(() => RoleModel /*, (role) => role.users */)
  role: RoleModel;

  @OneToOne(() => EmailVerifyModel)
  @JoinColumn()
  activation: EmailVerifyModel;

  @Field(() => AuthorModel, { nullable: true })
  @OneToOne(() => AuthorModel, (author) => author.user, { nullable: true })
  @JoinColumn()
  author_profile: AuthorModel;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password) return;

    const saltRound: number = 10;
    const bcSaltRound = await genSalt(saltRound);
    this.password = await hash(this.password, bcSaltRound);
  }

  // Map's fields (fields created using things like loadRelationCountAndMap)
  @Field(() => Number, { nullable: true })
  mangas_favorites?: number;
}
