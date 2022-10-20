import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { LoggerOptions } from 'typeorm';

// Models or Entities
import { RoleModel } from './models/role/role.model';
import { UserModel } from './models/user/user.model';
import { MangaModel } from './models/manga/manga.model';
import { GenreModel } from './models/genre/genre.model';
import { AuthorModel } from './models/author/author.model';
import { InviteModel } from './models/invite/invite.model';
import { CommentModel } from './models/comment/comment.model';
import { LanguageModel } from './models/language/language.model';
import { EmailVerifyModel } from './models/email-verify/email-verify.model';

// Services
// import { RoleModelService } from './models/role/role.model.service';
// import { UserModelService } from './models/user/user-model.service';
// import { MangaModelService } from './models/manga/manga-model.service';
// import { GenreModelService } from './models/genre/genre-model.service';
// import { AuthorModelService } from './models/author/author-model.service';
// import { InviteModelService } from './models/invite/invite-model.service';
// import { CommentModelService } from './models/comment/comment-model.service';
// import { LanguageModelService } from './models/language/language-model.service';
// import { EmailVerifyModelService } from './models/email-verify/email-verify-model.service';

@Module({
  imports: [
    // DB config
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        schema: configService.get('DATABASE_SCHEMA'),
        url: configService.get('DATABASE_URL'),
        entities: [
          RoleModel,
          UserModel,
          MangaModel,
          GenreModel,
          AuthorModel,
          InviteModel,
          CommentModel,
          LanguageModel,
          EmailVerifyModel,
        ],
        synchronize:
          configService.get('NODE_ENV') != 'production' ? true : false,
        autoLoadEntities: true,
        logging: process.env.LOG.split('-') as LoggerOptions,
        extra:
          configService.get('NODE_ENV') == 'production'
            ? {
                ssl: {
                  sslmode: true,
                  rejectUnauthorized: false,
                },
              }
            : {},
      }),
    }),
  ],
  //   repos
  //   TypeOrmModule.forFeature([
  //     RoleModel,
  //     UserModel,
  //     MangaModel,
  //     GenreModel,
  //     AuthorModel,
  //     InviteModel,
  //     CommentModel,
  //     LanguageModel,
  //     EmailVerifyModel,
  //   ]),
  // ],
  // providers: [
  //   RoleModelService,
  //   UserModelService,
  //   MangaModelService,
  //   GenreModelService,
  //   AuthorModelService,
  //   InviteModelService,
  //   CommentModelService,
  //   LanguageModelService,
  //   EmailVerifyModelService,
  // ],
  // exports: [
  //   RoleModelService,
  //   UserModelService,
  //   MangaModelService,
  //   GenreModelService,
  //   AuthorModelService,
  //   InviteModelService,
  //   CommentModelService,
  //   LanguageModelService,
  //   EmailVerifyModelService,
  // ],
})
export class DatabaseModule {}
