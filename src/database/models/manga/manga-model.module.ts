import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Model
import { MangaModel } from './manga.model';

// Service
import { MangaModelService } from './manga-model.service';

@Module({
  imports: [TypeOrmModule.forFeature([MangaModel])],
  exports: [MangaModelService],
  providers: [MangaModelService],
})
export class MangaModelModule {}
