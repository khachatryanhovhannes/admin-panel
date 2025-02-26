import { IsString } from 'class-validator';

export class CreateTextDto {
  @IsString()
  key: string;
}
