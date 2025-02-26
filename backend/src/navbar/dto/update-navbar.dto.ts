import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateNavbar {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  link: string;

  @IsNumber()
  @IsOptional()
  orderId: number;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
