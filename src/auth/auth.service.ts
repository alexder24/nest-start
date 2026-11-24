import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { User } from '../users/user.entity.js';
import type { RegisterDto } from './dto/register.dto.js';
import type { LoginDto } from './dto/login.dto.js';
import { PasswordHasher } from './password-hasher.service.js';
import { TokenService } from './token.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async register(dto: RegisterDto) {
    const passwordHash = await this.passwordHasher.hash(dto.password);

    return this.usersRepository.manager.transaction(async (manager) => {
      const usersRepository = manager.getRepository(User);
      const user = usersRepository.create({
        login: dto.login,
        email: dto.email,
        age: dto.age,
        bio: dto.bio,
        passwordHash,
      });

      const savedUser = await usersRepository.save(user);
      const tokens = await this.tokenService.issuePair(savedUser.id);
      const refreshTokenHash = this.tokenService.hashRefreshToken(
        tokens.refresh_token,
      );

      await usersRepository.update(savedUser.id, { refreshTokenHash });

      return {
        id: savedUser.id,
        login: savedUser.login,
        email: savedUser.email,
        age: savedUser.age,
        bio: savedUser.bio,
        ...tokens,
      };
    });
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { login: dto.login },
    });

    if (!user) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    const isPasswordValid = await this.passwordHasher.verify(
      user.passwordHash,
      dto.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    const tokens = await this.tokenService.issuePair(user.id);
    const refreshTokenHash = this.tokenService.hashRefreshToken(
      tokens.refresh_token,
    );

    await this.usersRepository.update(user.id, { refreshTokenHash });

    return tokens;
  }

  async logout(userId: number): Promise<void> {
    await this.usersRepository.update(userId, { refreshTokenHash: null });
  }
}
