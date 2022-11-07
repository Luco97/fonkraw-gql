import { Module } from '@nestjs/common';

import { AuthModule } from '@shared/auth';
import { UserModelModule } from '@database/models/user';
import { AuthorModelModule } from '@database/models/author';

import { ReadResolver } from './resolvers/read.resolver';
import { CreateResolver } from './resolvers/create.resolver';
import { UpdateResolver } from './resolvers/update.resolver';

@Module({
  imports: [AuthorModelModule, UserModelModule, AuthModule],
  providers: [CreateResolver, UpdateResolver, ReadResolver],
})
export class AuthorModule {}
