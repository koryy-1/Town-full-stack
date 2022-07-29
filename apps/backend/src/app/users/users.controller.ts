import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Управление пользователями')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({summary: 'получить всех пользователей'})
  @ApiResponse({status: 200, type: [User]})
  @Get()
  public getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  @ApiOperation({summary: 'получить 1 пользователя по id'})
  @ApiResponse({status: 200, type: User})
  @Get('edit/:id')
  public findUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @ApiOperation({summary: 'создать пользователя'})
  @ApiResponse({status: 201})
  @UseGuards(JwtAuthGuard)
  @Post('edit')
  // @Roles(Role.Admin)
  public createUser(@Body() userDto: CreateUserDto) {
    return this.usersService.create(userDto);
  }

  @ApiOperation({summary: 'изменить данные пользователя'})
  @ApiResponse({status: 200})
  @UseGuards(JwtAuthGuard)
  @Put('edit/:id')
  public updateUser(@Param('id', ParseIntPipe) id: number, @Body() userDto: CreateUserDto) {
    return this.usersService.update(id, userDto);
  }

  @ApiOperation({summary: 'удалить пользователя'})
  @ApiResponse({status: 200})
  @UseGuards(JwtAuthGuard)
  @Delete('edit/:id')
  public deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.delete(id);
  }
}
