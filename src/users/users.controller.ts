import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { UsersService } from './users.service.js';
import type { UserProfile } from './users.service.js';
import { GetUsersQueryDto } from './dto/get-users-query.dto.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: AuthenticatedUser): Promise<UserProfile> {
    return this.usersService.getProfile(user.id);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() query: GetUsersQueryDto) {
    return this.usersService.findAll(query);
  }
}
