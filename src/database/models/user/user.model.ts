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
export class UserModel {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
    length: 40,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 60,
  })
  email: string;

  @Column({
    type: 'varchar',
    select: false,
  })
  password: string;

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
}
