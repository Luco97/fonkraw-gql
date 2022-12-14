import { Field, InputType } from '@nestjs/graphql';

@InputType()
// @ArgsType() // No funciona como dice la documentacion, seguir usando InputType
export class findAll {
  @Field(() => Number, {
    nullable: true,
    defaultValue: 10,
    description: 'quantity of items',
  })
  take: number;

  @Field(() => Number, {
    nullable: true,
    defaultValue: 0,
    description: 'number of items to skip',
  })
  skip: number;

  @Field(() => String, {
    nullable: true,
    defaultValue: 'create_at',
    description: 'field selected for order',
  })
  orderBy: string;

  @Field(() => String, {
    nullable: true,
    defaultValue: 'ASC',
    description: 'if is ASCendent or DESCendent',
  })
  order: 'ASC' | 'DESC';
}

export const find_all_default: findAll = {
  take: 10,
  skip: 0,
  orderBy: 'created_at',
  order: 'ASC',
};
