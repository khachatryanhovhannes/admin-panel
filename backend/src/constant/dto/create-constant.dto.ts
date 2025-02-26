import { IsString } from 'class-validator';

export class CreateConstantDto {
  @IsString()
  key: string;

  @IsString()
  value: string;
}
