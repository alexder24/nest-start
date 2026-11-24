import { IsString, Matches } from 'class-validator';

export class LoginDto {
  @IsString()
  @Matches(/\S/)
  login: string;

  @IsString()
  @Matches(/\S/)
  password: string;
}
