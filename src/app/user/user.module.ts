import { Module } from '@nestjs/common';

// Modules
import { AuthModule } from '@shared/auth';
import { UserModelModule } from '@database/models/user';
import { RoleModelModule } from '@database/models/role';
import { InviteModelModule } from '@database/models/invite';
import { EmailVerifyModelModule } from '@database/models/email-verify';

// Resolvers
import { ReadResolver } from './invite/resolver/read.resolver';
import { SignInResolver } from './user/resolver/sign-in.resolver';
import { RegisterResolver } from './user/resolver/register.resolver';

// Services
import { UserService } from './user/services/user.service';

@Module({
  imports: [
    AuthModule,
    UserModelModule,
    RoleModelModule,
    InviteModelModule,
    EmailVerifyModelModule,
  ],
  providers: [SignInResolver, RegisterResolver, ReadResolver, UserService],
})
export class UserModule {}
