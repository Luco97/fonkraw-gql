import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Model
import { AuthorModel } from './author.model';

// Service
import { AuthorModelService } from './author-model.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuthorModel])],
  exports: [AuthorModelService],
  providers: [AuthorModelService],
})
export class AuthorModelModule {}
