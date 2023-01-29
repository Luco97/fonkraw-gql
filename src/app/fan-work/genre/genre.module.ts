import { Module } from '@nestjs/common';

// Modules
import { GenreModelModule } from '@database/models/genre';

// Resolvers
import { ReadResolver } from './resolvers/read.resolver';
import { UpdateResolver } from './resolvers/update.resolver';

@Module({
  imports: [GenreModelModule],
  providers: [ReadResolver, UpdateResolver],
})
export class GenreModule {}
