import { Module } from '@nestjs/common';

// Modules
import { LanguageModelModule } from '@database/models/language';

// Resolvers
import { ReadResolver } from './resolver/read.resolver';

@Module({
  imports: [LanguageModelModule],
  providers: [ReadResolver],
})
export class LanguageModule {}
