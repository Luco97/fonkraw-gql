import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Model
import { GenreModel } from './genre.model';

// Service
import { GenreModelService } from './genre-model.service';

@Module({
  imports: [TypeOrmModule.forFeature([GenreModel])],
  exports: [GenreModelService],
  providers: [GenreModelService],
})
export class GenreModelModule {}
