import { Module } from '@nestjs/common';

// Modules
import { AuthModule } from '@shared/auth';
import { UserModelModule } from '@database/models/user';
import { MangaModelModule } from '@database/models/manga';
import { CommentModelModule } from '@database/models/comment';

// Resolvers
import { GetResolver } from './resolvers/get.resolver';
import { CreateResolver } from './resolvers/create.resolver';
import { DeleteResolver } from './resolvers/delete.resolver';
import { CommentService } from './services/comment.service';

@Module({
  imports: [CommentModelModule, AuthModule, MangaModelModule, UserModelModule],
  providers: [CreateResolver, GetResolver, DeleteResolver, CommentService],
})
export class CommentModule {}
