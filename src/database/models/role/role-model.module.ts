import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Model
import { RoleModel } from './role.model';

// Service
import { RoleModelService } from './role.model.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoleModel])],
  exports: [RoleModelService],
  providers: [RoleModelService],
})
export class RoleModelModule {}
