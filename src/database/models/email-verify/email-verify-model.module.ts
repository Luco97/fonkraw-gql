import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Model
import { EmailVerifyModel } from './email-verify.model';

// Service
import { EmailVerifyModelService } from './email-verify-model.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmailVerifyModel])],
  exports: [EmailVerifyModelService],
  providers: [EmailVerifyModelService],
})
export class EmailVerifyModelModule {}
