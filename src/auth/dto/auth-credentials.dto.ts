import { IsString, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  username: string;
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  password: string;
}