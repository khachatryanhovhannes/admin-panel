import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTextDto {
  @IsString()
  @IsNotEmpty()
  key: string;
}
