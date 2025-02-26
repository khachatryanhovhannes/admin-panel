import { IsString } from 'class-validator';

export class UpdateConstantDto {
  @IsString()
  key: string;

  @IsString()
  value: string;
}
