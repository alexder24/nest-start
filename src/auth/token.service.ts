import { createHash, randomUUID } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config.js';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
  ) {}

  async issuePair(userId: number) {
    const sub = String(userId);

    const accessToken = await this.jwtService.signAsync(
      { sub, tokenType: 'access' },
      {
        algorithm: 'HS256',
        secret: this.config.accessSecret,
        expiresIn: this.config.accessTtlSeconds,
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub, tokenType: 'refresh', jti: randomUUID() },
      {
        algorithm: 'HS256',
        secret: this.config.refreshSecret,
        expiresIn: this.config.refreshTtlSeconds,
      },
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  hashRefreshToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
