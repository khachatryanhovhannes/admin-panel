import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTextContentDto {
  @IsString()
  @IsNotEmpty()
  content?: string;
}
