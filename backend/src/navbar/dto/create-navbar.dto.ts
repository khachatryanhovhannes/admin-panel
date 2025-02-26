import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNavbar {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  link: string;



  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
