import { Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs'
// import { User } from './models/user.interface';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  
  public async getUsers(): Promise<User[]> {
    const result = await this.usersRepository.find();
    if (!result) {
      throw new NotFoundException('Users not found.');
    }
    return result
  }

  public async findOneById(id: number) {
    const result = await this.usersRepository.findOneBy({ id });
    // if (!result) {
    //   throw new NotFoundException('User not exists.');
    // }
    return result;
  }

  public async findOneByLogin(login: string) {
    const result = await this.usersRepository.findOneBy({ login });
    // if (!result) {
    //   throw new NotFoundException('User not exists.');
    // }
    return result;
  }
  
  public async create(userDto: CreateUserDto) {
    const loginExists = await this.usersRepository.findOneBy({ login: userDto.login });
    // this.logger.log(`loginExists?.login: ${loginExists?.login}`);
    if (loginExists) {
      throw new UnprocessableEntityException('Login already exists.');
    }
    this.logger.log(`create new user`);
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    // this.logger.log(`userDto: ${userDto.login} ${userDto.password}`);

    // необходимо ставить id: null иначе эта херня не будет автоинкрементироваться
    const newUser = {...userDto, password: hashPassword, id: null} as User
    // this.logger.log(`newUser: ${newUser.login}`);
    await this.usersRepository.insert(newUser)
    return newUser
  }

  public async update(entityId: number, userDto: CreateUserDto): Promise<UpdateResult> {
    this.logger.log(`Updating user with id: ${entityId}`);

    const userExists = await this.usersRepository.findOneBy({ id: entityId });

    if (!userExists) {
      throw new NotFoundException('User not found.');
    }

    // if the login is already in use by another user
    const loginExists = await this.usersRepository.findOneBy({ login: userDto.login });
    if (loginExists && loginExists.login === userDto.login && loginExists.id !== entityId) {
      throw new UnprocessableEntityException('Login already exists.');
    }

    // userDto.id = entityId
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    return await this.usersRepository.update({id: entityId}, {...userDto, password: hashPassword, id: entityId})
  }
  
  public async delete(id: number) {
    this.logger.log(`delete user with id: ${id}`);
    const result = await this.usersRepository.delete(id);
    // this.logger.log(`result: ${result.affected}`);

    if (result.affected === 0) {
      throw new UnprocessableEntityException('Error to delete.');
    }
  }

}
