import { Module } from '@nestjs/common';

// Modules
import { AuthModule } from '@shared/auth';
import { RoleModelModule } from '@database/models/role';
import { GenreModelModule } from '@database/models/genre';

// Resolvers
import { ReadResolver } from './resolvers/read.resolver';
import { UpdateResolver } from './resolvers/update.resolver';

// Service
import { GenreService } from './service/genre.service';

@Module({
  imports: [GenreModelModule, RoleModelModule, AuthModule],
  providers: [ReadResolver, UpdateResolver, GenreService],
})
export class GenreModule {}
