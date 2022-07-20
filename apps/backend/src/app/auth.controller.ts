import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
// import { User } from './models/user.interface';

@Controller('auth')
export class AuthController {
    
  constructor(private readonly appService: AppService) {}

  @Post('login')
  public login(@Body() user: User) {
    return this.appService.login(user);
  }

  @Post('register')
  public register(@Body() user: User) {
    return this.appService.register(user);
  }
}
