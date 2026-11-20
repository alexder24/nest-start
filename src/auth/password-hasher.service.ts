import * as argon2 from 'argon2';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordHasher {
  hash(password: string): Promise<string> {
    return argon2.hash(password);
  }
}
