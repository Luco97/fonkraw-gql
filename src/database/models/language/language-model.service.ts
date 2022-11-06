import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { LanguageModel } from './language.model';

@Injectable()
export class LanguageModelService {
  constructor(
    @InjectRepository(LanguageModel)
    private _languageRepo: Repository<LanguageModel>,
  ) {}
}
