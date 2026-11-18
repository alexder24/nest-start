import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { unique: true })
  login: string;

  @Column('varchar', { unique: true })
  email: string;

  @Column('text', { name: 'password_hash' })
  passwordHash: string;

  @Column('integer')
  age: number;

  @Column('varchar', { length: 1000 })
  bio: string;
}
