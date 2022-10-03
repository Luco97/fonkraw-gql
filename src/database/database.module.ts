import { Module } from '@nestjs/common';

// Services
import { RoleModelService } from './models/role/role.model.service';
import { UserModelService } from './models/user/user-model.service';
import { MangaModelService } from './models/manga/manga-model.service';
import { GenreModelService } from './models/genre/genre-model.service';
import { AuthorModelService } from './models/author/author-model.service';
import { CommentModelService } from './models/comment/comment-model.service';
import { LanguageModelService } from './models/language/language-model.service';

@Module({
  providers: [
    RoleModelService,
    UserModelService,
    MangaModelService,
    GenreModelService,
    AuthorModelService,
    CommentModelService,
    LanguageModelService,
  ],
  exports: [
    RoleModelService,
    UserModelService,
    MangaModelService,
    GenreModelService,
    AuthorModelService,
    CommentModelService,
    LanguageModelService,
  ],
})
export class DatabaseModule {}
