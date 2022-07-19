import { Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { User } from './models/user.interface';

@Injectable()
export class AppService {
  private users: User[] = [{
    id: 0,
    login: '',
    password: '',
    firstName: '',
    lastName: '',
    patronymic: '',
    role: '',
    isActive: false
  }]
  private readonly logger = new Logger(AppService.name);
  
  getUsers(): User[] {
    return this.users;
  }
  
  public create(user: User): User {
    const loginExists: boolean = this.users.some(
      (item) => item.id === user.id,
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

  
  public update(id: number, user: User): User {
    this.logger.log(`Updating post with id: ${id}`);

    const index: number = this.users.findIndex((item) => item.id === id);

    // -1 is returned when no findIndex() match is found
    if (index === -1) {
      throw new NotFoundException('User not found.');
    }

    // if the login is already in use by another user
    const loginExists: boolean = this.users.some(
      (item) => item.login === user.login && item.id !== id,
    );
    if (loginExists) {
      throw new UnprocessableEntityException('User login already exists.');
    }

    const newUser: User = {
      ...user,
      id,
    };

    this.users[index] = newUser;

    return newUser;
  }
  
  public delete(id: number): void {
    const index: number = this.users.findIndex(user => user.id === id);

    // -1 is returned when no findIndex() match is found
    if (index === -1) {
      throw new NotFoundException('User not found.');      
    }

    this.users.splice(index, 1);
  }

}
