import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleModel } from './role.model';

@Injectable()
export class RoleModelService {
  constructor(
    @InjectRepository(RoleModel) private _roleRepo: Repository<RoleModel>,
  ) {}

  create_basic_role(): Promise<RoleModel> {
    return this._roleRepo.save(this._roleRepo.create({ role_name: 'basic' }));
  }

  get get_basic(): Promise<RoleModel> {
    return this._roleRepo
      .createQueryBuilder('role')
      .where('role.role_name = :role_name', { role_name: 'basic' })
      .getOne();
  }

  find_one(uuid: string): Promise<RoleModel> {
    return this._roleRepo
      .createQueryBuilder('role')
      .where('role.id = :uuid', { uuid })
      .getOne();
  }
}
