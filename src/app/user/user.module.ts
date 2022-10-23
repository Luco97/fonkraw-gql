import { Module } from '@nestjs/common';

import { UserModelModule } from '@database/models/user';
import { RoleModelModule } from '@database/models/role';
import { InviteModelModule } from '@database/models/invite';
import { EmailVerifyModelModule } from '@database/models/email-verify';

import { ReadResolver } from './invite/resolver/read.resolver';
import { SignInResolver } from './user/resolver/sign-in.resolver';
import { RegisterResolver } from './user/resolver/register.resolver';

@Module({
  imports: [
    UserModelModule,
    RoleModelModule,
    InviteModelModule,
    EmailVerifyModelModule,
  ],
  providers: [SignInResolver, RegisterResolver, ReadResolver],
})
export class UserModule {}
