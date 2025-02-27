import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignInDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
