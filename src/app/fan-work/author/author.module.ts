import { Module } from '@nestjs/common';

// Modules
import { AuthModule } from '@shared/auth';
import { UserModelModule } from '@database/models/user';
import { AuthorModelModule } from '@database/models/author';

// Resolvers
import { ReadResolver } from './resolvers/read.resolver';
import { CreateResolver } from './resolvers/create.resolver';
import { UpdateResolver } from './resolvers/update.resolver';

// Services
import { AuthorService } from './services/author.service';

@Module({
  imports: [AuthorModelModule, UserModelModule, AuthModule],
  providers: [CreateResolver, UpdateResolver, ReadResolver, AuthorService],
})
export class AuthorModule {}
