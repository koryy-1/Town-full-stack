import { Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
// import { User } from './models/user.interface';

@Injectable()
export class AppService {
  // private users: User[]
  private readonly logger = new Logger(AppService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  
  public getUsers(): Promise<User[]> {
    const result = this.usersRepository.find();
    if (!result) {
      throw new NotFoundException('Users not found.');
    }
    return result
  }

  public findOne(id: number): Promise<User> {
    // const user: User = this.users.find(
    //   (item) => item.id === id,
    // );
    const result = this.usersRepository.findOneByOrFail({ id });
    if (!result) {
      throw new NotFoundException('User not exists.');
    }

    return result;
  }
  
  public create(user: User): Promise<InsertResult> {
    const loginExists = this.usersRepository.findOneByOrFail({ login: user.login });
    // const loginExists: boolean = this.users.some(
    //   (item) => item.login === user.login,
    // );
    if (loginExists) {
      throw new UnprocessableEntityException('Login already exists.');
    }

    return this.usersRepository.insert(user)

    // find the next id for a new user
    // const maxId: number = Math.max(...this.users.map((user) => user.id), 0);
    // const id: number = maxId + 1;

    // const newUser: User = {
    //   ...user,
    //   id,
    // };

    // this.users.push(newUser);

  }

  public update(id: number, user: User): Promise<UpdateResult> {
    this.logger.log(`Updating post with id: ${id}`);

    const userExists = this.usersRepository.findOneByOrFail({ id: user.id });

    if (!userExists) {
      throw new NotFoundException('User not found.');
    }

    // const index: number = this.users.findIndex((item) => item.id === id);

    // // -1 is returned when no findIndex() match is found
    // if (index === -1) {
    //   throw new NotFoundException('User not found.');
    // }

    // if the login is already in use by another user
    const loginExists = this.usersRepository.findOneByOrFail({ login: user.login }); // id: !user.id
    if (loginExists) {
      throw new UnprocessableEntityException('Login already exists.');
    }

    return this.usersRepository.update(id, user)

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
    this.logger.log(`delete post with id: ${id}`);
    const result = await this.usersRepository.delete(id);
    this.logger.log(result);
    
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
