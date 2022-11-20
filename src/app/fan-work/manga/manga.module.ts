import { Module } from '@nestjs/common';

// Modules
import { AuthModule } from '@shared/auth';
import { MangaModelModule } from '@database/models/manga';
import { AuthorModelModule } from '@database/models/author';

// Resolvers
import { ReadResolver } from './resolvers/read.resolver';
import { CreateResolver } from './resolvers/create.resolver';
import { DeleteResolver } from './resolvers/delete.resolver';
import { UpdateResolver } from './resolvers/update.resolver';

@Module({
  imports: [AuthModule, MangaModelModule, AuthorModelModule],
  providers: [ReadResolver, CreateResolver, DeleteResolver, UpdateResolver],
})
export class MangaModule {}
