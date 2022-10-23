import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';

import { AuthModule } from '@shared/auth';

import { DatabaseModule } from '../database/database.module';

import { UserModule } from './user/user.module';
import { MangaModule } from './fan-work/manga/manga.module';
import { GenreModule } from './fan-work/genre/genre.module';
import { AuthorModule } from './fan-work/author/author.module';
import { CommentModule } from './fan-work/comment/comment.module';
import { LanguageModule } from './fan-work/language/language.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'types.gql',
      persistedQueries: false, // heroku deploy
      cache: 'bounded', // heroku deploy
    }),
    AuthModule,
    DatabaseModule,
    UserModule,
    MangaModule,
    GenreModule,
    AuthorModule,
    CommentModule,
    LanguageModule,
  ],
  providers: [],
})
export class FanWorkModule {}
