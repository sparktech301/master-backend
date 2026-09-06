import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: 'Split AC Basic Servicing' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Filter cleaning, gas checking and indoor wash' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ example: 800 })
  @IsNumber()
  @IsNotEmpty()
  price!: number;

  @ApiProperty({ example: 45 })
  @IsNumber()
  @IsOptional()
  durationMin?: number;

  @ApiProperty({ example: 'category-uuid-here' })
  @IsUUID()
  @IsNotEmpty()
  categoryId!: string;
}

export class UpdateServiceDto {
  @ApiProperty({ example: 'Split AC Basic Servicing' })
  @IsString()
  @IsOptional()
  title!: string;

  @ApiProperty({ example: 'Filter cleaning, gas checking and indoor wash' })
  @IsString()
  @IsOptional()
  description!: string;

  @ApiProperty({ example: 800 })
  @IsNumber()
  @IsOptional()
  price!: number;

  @ApiProperty({ example: 45 })
  @IsNumber()
  @IsOptional()
  durationMin?: number;

  @ApiProperty({ example: 'category-uuid-here' })
  @IsUUID()
  @IsOptional()
  categoryId!: string;
}
