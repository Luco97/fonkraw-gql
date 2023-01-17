import { Module } from '@nestjs/common';

import { AuthModule } from '@shared/auth';
import { FanWorkModule } from './app/fan-work.module';
import { RoleModelModule } from '@database/models/role';
// import { MailModule } from '@shared/mail';
// import { DatabaseModule } from './database/database.module';
// import { AuthorModelModule } from './database/models/author/author-model.module';
// import { GenreModelModule } from './database/models/genre/genre-model.module';

@Module({
  imports: [
    // DatabaseModule,
    AuthModule,
    FanWorkModule,
    RoleModelModule,
    // MailModule,
    // AuthorModelModule,
    // GenreModelModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
