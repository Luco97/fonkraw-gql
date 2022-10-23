import { MangaModel } from '@database/models/manga';
import { Query, Resolver } from '@nestjs/graphql';
import { DeepPartial } from 'typeorm';

@Resolver()
export class ReadResolver {
  @Query(() => [MangaModel])
  async findAll(): Promise<DeepPartial<MangaModel[]>> {
    return new Promise((resolve, reject) =>
      resolve([{ id: 123, active: false }]),
    );
  }
}
