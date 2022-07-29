import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @ApiProperty({example: 1, description: 'уникальный идентификатор'})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({example: 'mybestlogin', description: 'логин для аккаунта'})
  @Column({ unique: true })
  login: string;

  @ApiProperty({example: 'mybestpASSword', description: 'пароль для аккаунта'})
  @Column()
  password: string;

  @ApiProperty({example: 'Иван', description: 'Имя'})
  @Column()
  firstName: string;

  @ApiProperty({example: 'Иванов', description: 'Фамилия'})
  @Column()
  lastName: string;

  @ApiProperty({example: 'Иванович', description: 'Отчество'})
  @Column()
  patronymic: string;

  @ApiProperty({example: 'admin', description: 'роль пользователя'})
  @Column()
  role: string;

  @ApiProperty({example: 'true', description: 'статус онлайн'})
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({example: 'eyJhbGciOiJIUzI1NiIsIn...', description: 'jwt токен'})
  @Column({
    unique: true,
    nullable: true,
  })
  token: string | null;
}
