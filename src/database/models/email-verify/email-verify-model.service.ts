import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { EmailVerifyModel } from './email-verify.model';

@Injectable()
export class EmailVerifyModelService {
  constructor(
    @InjectRepository(EmailVerifyModel)
    private _emailRepo: Repository<EmailVerifyModel>,
  ) {}
  get create(): Promise<EmailVerifyModel> {
    return this._emailRepo.save(this._emailRepo.create());
  }

  find_one(uuid: string): Promise<EmailVerifyModel> {
    return this._emailRepo
      .createQueryBuilder('email')
      .where('email.uuid = :uuid', { uuid })
      .getOne();
  }

  update(uuid: string): Promise<EmailVerifyModel> {
    return this._emailRepo.save({ uuid, activated: true });
  }
}
