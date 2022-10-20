import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Model
import { UserModel } from './user.model';

// Service
import { UserModelService } from './user-model.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  exports: [UserModelService],
  providers: [UserModelService],
})
export class UserModelModule {}
