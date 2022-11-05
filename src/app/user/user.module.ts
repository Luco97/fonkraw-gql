import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Modules
import { AuthModule } from '@shared/auth';
import { MailModule } from '@shared/mail';
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
    MailModule,
    AuthModule,
    UserModelModule,
    RoleModelModule,
    InviteModelModule,
    EmailVerifyModelModule,
    ConfigModule.forRoot({}),
  ],
  providers: [SignInResolver, RegisterResolver, ReadResolver, UserService],
})
export class UserModule {}
