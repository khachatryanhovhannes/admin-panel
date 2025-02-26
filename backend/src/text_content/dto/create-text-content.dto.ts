import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateTextContentDto {
  @IsInt()
  textId: number;

  @IsInt()
  languageId: number;

  @IsString()
  @IsOptional()
  content?: string;
}
