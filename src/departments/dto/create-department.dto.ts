import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  order: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  population: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  area: number;

  @IsString()
  @IsOptional()
  flag?: string;
}
