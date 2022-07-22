import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  login: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  patronymic: string;

  @Column()
  role: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    // type: 'text',
    // unique: true,
    nullable: true,
  })
  token: string | null;
}
