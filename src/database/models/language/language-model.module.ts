import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Model
import { LanguageModel } from './language.model';

// Service
import { LanguageModelService } from './language-model.service';

@Module({
  imports: [TypeOrmModule.forFeature([LanguageModel])],
  exports: [LanguageModelService],
  providers: [LanguageModelService],
})
export class LanguageModelModule {}
