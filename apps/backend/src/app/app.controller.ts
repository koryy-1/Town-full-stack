import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe, Put } from '@nestjs/common';

import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { Role } from './models/role.enum';
// import { User } from './models/user.interface';
import { Roles } from './roles.decorator';

@Controller('users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public getUsers(): Promise<User[]> {
    return this.appService.getUsers();
  }

  @Get('edit/:id')
  public findUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.appService.findOne(id);
  }

  @Post('edit')
  @Roles(Role.Admin)
  public createUser(@Body() user: User) {
    return this.appService.create(user);
  }

  @Put('edit/:id')
  public updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: User) {
    return this.appService.update(id, user);
  }

  @Delete('edit/:id')
  public deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.appService.delete(id);
  }
}
