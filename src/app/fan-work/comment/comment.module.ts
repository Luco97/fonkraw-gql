import { Module } from '@nestjs/common';
// Modules

// Resolvers
import { GetResolver } from './resolvers/get.resolver';
import { ReadResolver } from './resolver/read.resolver';
import { CreateResolver } from './resolvers/create.resolver';
import { DeleteResolver } from './resolvers/delete.resolver';

@Module({
  imports: [],
  providers: [ReadResolver, CreateResolver, GetResolver, DeleteResolver],
})
export class CommentModule {}
