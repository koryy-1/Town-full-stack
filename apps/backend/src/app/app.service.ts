import { Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
// import { User } from './models/user.interface';

@Injectable()
export class AppService {
  private users: User[]
  private readonly logger = new Logger(AppService.name);

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

  public async findOne(id: number): Promise<User> {
    // const user: User = this.users.find(
    //   (item) => item.id === id,
    // );
    const result = await this.usersRepository.findOneBy({ id });
    if (!result) {
      throw new NotFoundException('User not exists.');
    }

    return result;
  }
  
  public async create(user: User): Promise<InsertResult> {
    this.logger.log(`create new user`);
    const loginExists = await this.usersRepository.findOneBy({ login: user.login });
    this.logger.log(`loginExists?.login: ${loginExists?.login}`);
    // const loginExists: boolean = this.users.some(
    //   (item) => item.login === user.login,
    // );
    if (loginExists) {
      throw new UnprocessableEntityException('Login already exists.');
    }

    return await this.usersRepository.insert({
      login: user.login,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      patronymic: user.patronymic,
      role: user.role,
      isActive: user.isActive,
      // token?: string;
    })

    // find the next id for a new user
    // const maxId: number = Math.max(...this.users.map((user) => user.id), 0);
    // const id: number = maxId + 1;

    // const newUser: User = {
    //   ...user,
    //   id,
    // };

    // this.users.push(newUser);

  }

  public async update(entityId: number, user: User): Promise<UpdateResult> {
    this.logger.log(`Updating user with id: ${entityId}`);

    const userExists = await this.usersRepository.findOneBy({ id: entityId });

    if (!userExists) {
      throw new NotFoundException('User not found.');
    }

    // const index: number = this.users.findIndex((item) => item.id === id);

    // // -1 is returned when no findIndex() match is found
    // if (index === -1) {
    //   throw new NotFoundException('User not found.');
    // }

    // if the login is already in use by another user
    const loginExists = await this.usersRepository.findOneBy({ login: user.login });
    if (loginExists && loginExists.login === user.login && loginExists.id !== entityId) {
      throw new UnprocessableEntityException('Login already exists.');
    }

    user.id = entityId

    return await this.usersRepository.update({id: entityId}, user)

    // const loginExists: boolean = this.users.some(
    //   (item) => item.login === user.login && item.id !== id,
    // );
    // if (loginExists) {
    //   throw new UnprocessableEntityException('User login already exists.');
    // }

    // const newUser: User = {
    //   ...user,
    //   id,
    // };

    // this.users[index] = newUser;

    // return newUser;
  }
  
  public async delete(id: number): Promise<void> {
    this.logger.log(`delete user with id: ${id}`);
    const result = await this.usersRepository.delete(id);
    this.logger.log(`result: ${result.affected}`);

    if (result.affected === 0) {
      throw new UnprocessableEntityException('Error to delete.');
    }
    // const index: number = this.users.findIndex(user => user.id === id);

    // // -1 is returned when no findIndex() match is found
    // if (index === -1) {
    //   throw new NotFoundException('User not found.');      
    // }

    // this.users.splice(index, 1);
  }

  public register(user: User): User {
    const loginExists: boolean = this.users.some(
      (item) => item.login === user.login,
    );
    if (loginExists) {
      throw new UnprocessableEntityException('Login already exists.');
    }

    // find the next id for a new user
    const maxId: number = Math.max(...this.users.map((user) => user.id), 0);
    const id: number = maxId + 1;

    const newUser: User = {
      ...user,
      id,
    };

    this.users.push(newUser);

    return newUser;
  }

  public login(user: User): User {
    const userExists: boolean = this.users.some(
      (item) => item.login === user.login,
    );
    if (!userExists) {
      throw new NotFoundException('User not exists.');
    }

    return user;
  }

}
