import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNavbarItem {
  @IsNumber()
  @IsNotEmpty()
  navId: number;

  @IsNumber()
  @IsNotEmpty()
  languageId: number;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

  @IsString()
  @IsNotEmpty()
  text: string;
}
