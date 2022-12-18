import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Modules
import { AuthModule } from '@shared/auth';
import { MailModule } from '@shared/mail';
import { UserModelModule } from '@database/models/user';
import { RoleModelModule } from '@database/models/role';
import { InviteModelModule } from '@database/models/invite';
import { EmailVerifyModelModule } from '@database/models/email-verify';

// user Resolvers
import { UpdateResolver } from './user/resolvers/update.resolver';
import { SignInResolver } from './user/resolvers/sign-in.resolver';
import { RegisterResolver } from './user/resolvers/register.resolver';

// invite Resolvers
import { GetResolver } from './invite/resolvers/get.resolver';
import { CheckResolver } from './invite/resolvers/check.resolver';
import { CreateResolver } from './invite/resolvers/create.resolver';

// Services
import { UserService } from './user/services/user.service';
import { ValidateResolver } from './user/resolvers/validate.resolver';
import { InviteService } from './invite/services/invite.service';

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
  providers: [
    // resolvers
    // User
    UpdateResolver,
    SignInResolver,
    RegisterResolver,
    ValidateResolver,
    // Invites
    GetResolver,
    CheckResolver,
    CreateResolver,
    // services
    UserService,
    InviteService,
  ],
})
export class UserModule {}
