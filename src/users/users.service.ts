import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { User } from './user.entity.js';

export interface UserProfile {
  id: number;
  login: string;
  email: string;
  age: number;
  bio: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getProfile(userId: number): Promise<UserProfile> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: {
        id: true,
        login: true,
        email: true,
        age: true,
        bio: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return {
      id: user.id,
      login: user.login,
      email: user.email,
      age: user.age,
      bio: user.bio,
    };
  }
}
