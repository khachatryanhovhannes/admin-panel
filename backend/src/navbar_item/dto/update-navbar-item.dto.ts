import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateNavbarItem {
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

  @IsString()
  @IsNotEmpty()
  text: string;
}
