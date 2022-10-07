import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserModel } from '../user/user.model';

@Entity()
export class RoleModel {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'ID de un rol, que este comentario exista en algun lado',
  })
  uuid: string;

  @Column({
    nullable: false,
    // select: false,
  })
  role_name: string;

  @OneToMany(() => UserModel, (user) => user.role)
  users: UserModel[];
}
