import { Module } from '@nestjs/common';

// Modules
import { AuthModule } from '@shared/auth';
import { MangaModelModule } from '@database/models/manga';
import { GenreModelModule } from '@database/models/genre';
import { AuthorModelModule } from '@database/models/author';

// Resolvers
import { ReadResolver } from './resolvers/read.resolver';
import { CreateResolver } from './resolvers/create.resolver';
import { DeleteResolver } from './resolvers/delete.resolver';
import { UpdateResolver } from './resolvers/update.resolver';

// Services
import { MangaService } from './services/manga.service';

@Module({
  imports: [AuthModule, MangaModelModule, AuthorModelModule, GenreModelModule],
  providers: [
    // Resolvers
    ReadResolver,
    CreateResolver,
    DeleteResolver,
    UpdateResolver,
    // Services
    MangaService,
  ],
})
export class MangaModule {}
