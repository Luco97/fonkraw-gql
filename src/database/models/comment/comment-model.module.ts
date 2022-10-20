import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Model
import { CommentModel } from './comment.model';

// Service
import { CommentModelService } from './comment-model.service';

@Module({
  imports: [TypeOrmModule.forFeature([CommentModel])],
  exports: [CommentModelService],
  providers: [CommentModelService],
})
export class CommentModelModule {}
