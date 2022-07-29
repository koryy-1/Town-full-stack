import { Body, Controller, ForbiddenException, Post, UnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {
  }
  
  @ApiOperation({summary: 'войти в аккаунт'})
  @Post('login')
  login(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto)
  }

  @ApiOperation({summary: 'зарегистрировать аккаунт и войти в него'})
  @Post('register')
  register(@Body() userDto: CreateUserDto) {
    return this.authService.register(userDto)
  }

}
