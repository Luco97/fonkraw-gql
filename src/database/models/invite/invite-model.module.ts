import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Model
import { InviteModel } from './invite.model';

// Service
import { InviteModelService } from './invite-model.service';

@Module({
  imports: [TypeOrmModule.forFeature([InviteModel])],
  exports: [InviteModelService],
  providers: [InviteModelService],
})
export class InviteModelModule {}
