import { Module } from '@nestjs/common';
import { ReadResolver } from './resolver/read.resolver';

@Module({
  providers: [ReadResolver]
})
export class CommentModule {}
