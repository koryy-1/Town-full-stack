import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe, Put } from '@nestjs/common';

import { AppService } from './app.service';
import { User } from './models/user.interface';

@Controller('users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public getUsers(): User[] {
    return this.appService.getUsers();
  }

  @Post('edit')
  public createUser(@Body() user: User) {
    return this.appService.create(user);
  }

  @Put('edit/:id')
  public updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: User): User {
    return this.appService.update(id, user);
  }

  @Delete('edit/:id')
  public deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.appService.delete(id);
  }
}
