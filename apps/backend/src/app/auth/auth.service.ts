import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs'
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/user.entity';
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {

  constructor(
    private userService: UsersService,
    private jwtService: JwtService
    ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto)
    return this.generateToken(user)
  }

  async register(userDto: CreateUserDto) {
    const loginExists = await this.userService.findOneByLogin(userDto.login);
    if (loginExists) {
      throw new HttpException('Login already exist', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.create(userDto)
    return this.generateToken(user)
  }

  private async generateToken(user: User) {
    const payload = {login: user.login, id: user.id, role: user.role}
    return {
      token: this.jwtService.sign(payload)
    }
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.findOneByLogin(userDto.login);
    if (user) {
      const passwordEquals = await bcrypt.compare(userDto.password, user.password);
      if (user && passwordEquals) {
        return user;
      }
    }
    throw new UnauthorizedException({message: 'Invalid login or password'})
  }
}
