import { Controller,  } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('auth')
export class AuthController {
    
  constructor(private readonly appService: AppService) {}

  // @Post('login')
  // login() {
  //   return this.appService.login();
  // }

  // @Post('register')
  // register(@Param('id') id: string) {
  //   return this.appService.register();
  // }
}
