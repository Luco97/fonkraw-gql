import { Module } from '@nestjs/common';

// Modules
import { GenreModelModule } from '@database/models/genre';

// Resolvers
import { ReadResolver } from './resolvers/read.resolver';

@Module({
  imports: [GenreModelModule],
  providers: [ReadResolver],
})
export class GenreModule {}
