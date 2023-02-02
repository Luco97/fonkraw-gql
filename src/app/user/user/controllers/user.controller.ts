import {
  Res,
  Body,
  Post,
  Param,
  UseGuards,
  Controller,
  SetMetadata,
  ParseIntPipe,
} from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import {
  Min,
  IsUUID,
  IsString,
  IsNumber,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { Response } from 'express';

import { RoleGuard } from '@guard/role.guard';
import { UserModelService } from '@database/models/user';
import { RoleModelService } from '@database/models/role';

class FindClass {
  @IsOptional()
  @IsNumber()
  @Min(1)
  take: number;

  @IsOptional()
  @IsNumber()
  skip: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  name: string;
}

class UpdateRole {
  @IsUUID()
  role_id: string;
}

@Controller('user')
export class UserController {
  constructor(
    private _userModel: UserModelService,
    private _roleModel: RoleModelService,
  ) {}

  @Post()
  @SetMetadata('roles', ['master'])
  @UseGuards(RoleGuard)
  user_list(@Body() find_body: FindClass, @Res() resp: Response) {
    const { name, skip, take } = find_body;
    this._userModel.find_all({ name, skip, take }).then(([users, count]) =>
      resp.status(HttpStatus.OK).json({
        users,
        count,
      }),
    );
  }

  @Post(':id')
  @SetMetadata('roles', ['master'])
  @UseGuards(RoleGuard)
  update_role(
    @Param('id', ParseIntPipe) user_id: number,
    @Body() find_body: UpdateRole,
    @Res() resp: Response,
  ) {
    const { role_id } = find_body;

    Promise.all([
      this._roleModel.find_one(role_id),
      this._userModel.find_one_by_id(user_id),
    ]).then(([rol, user]) => {
      if (!rol || !user)
        resp
          .status(HttpStatus.NOT_FOUND)
          .json({ message: `role doesn't exist` });
      else {
        this._userModel.update_user_role({ user_id, uuid: role_id });
      }
    });
  }
}
