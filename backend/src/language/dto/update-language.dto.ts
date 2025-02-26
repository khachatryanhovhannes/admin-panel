import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateLanguage {
  @IsString()
  @IsNotEmpty()
  enName: string;

  @IsString()
  @IsNotEmpty()
  nativeName: string;

  @IsString()
  @IsNotEmpty()
  shortName: string;

  @IsString()
  @IsOptional()
  iconUrl: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
