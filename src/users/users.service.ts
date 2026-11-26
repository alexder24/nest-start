import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, type Repository } from 'typeorm';
import { User } from './user.entity.js';
import type { GetUsersQueryDto } from './dto/get-users-query.dto.js';

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

  private toPublicProfile(user: User): UserProfile {
    return {
      id: user.id,
      login: user.login,
      email: user.email,
      age: user.age,
      bio: user.bio,
    };
  }

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

    return this.toPublicProfile(user);
  }

  async findAll(query: GetUsersQueryDto) {
    const { page, limit } = query;
    const search = query.search?.trim();
    const where = search ? { login: ILike(`%${search}%`) } : {};

    const [users, total] = await this.usersRepository.findAndCount({
      where,
      select: {
        id: true,
        login: true,
        email: true,
        age: true,
        bio: true,
      },
      order: { id: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items: users.map((user) => this.toPublicProfile(user)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
