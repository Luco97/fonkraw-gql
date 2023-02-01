import {
  Res,
  Body,
  Post,
  UseGuards,
  Controller,
  SetMetadata,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Response } from 'express';

import { RoleGuard } from '@guard/role.guard';
import { UserModelService } from '@database/models/user';
import { HttpStatus } from '@nestjs/common';

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

@Controller('user')
export class UserController {
  constructor(private _userModel: UserModelService) {}

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
    @Body() find_body,
    @Res() resp: Response,
  ) {}
}
