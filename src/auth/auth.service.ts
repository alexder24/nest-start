import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { User } from '../users/user.entity.js';
import type { RegisterDto } from './dto/register.dto.js';
import { PasswordHasher } from './password-hasher.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly passwordHasher: PasswordHasher,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async register(dto: RegisterDto) {
    const passwordHash = await this.passwordHasher.hash(dto.password);

    const user = this.usersRepository.create({
      login: dto.login,
      email: dto.email,
      age: dto.age,
      bio: dto.bio,
      passwordHash,
    });

    const savedUser = await this.usersRepository.save(user);

    return {
      id: savedUser.id,
      login: savedUser.login,
      email: savedUser.email,
      age: savedUser.age,
      bio: savedUser.bio,
    };
  }
}
