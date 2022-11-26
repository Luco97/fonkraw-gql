import { Module } from '@nestjs/common';
// Modules
import { CommentModelModule } from '@database/models/comment';

// Resolvers
import { GetResolver } from './resolvers/get.resolver';
import { CreateResolver } from './resolvers/create.resolver';
import { DeleteResolver } from './resolvers/delete.resolver';
import { AuthModule } from '@shared/auth';

@Module({
  imports: [CommentModelModule, AuthModule],
  providers: [CreateResolver, GetResolver, DeleteResolver],
})
export class CommentModule {}
