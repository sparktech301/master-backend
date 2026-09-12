import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateTechnicianProfileDto {
  @ApiPropertyOptional({
    format: 'uuid',
    example: '4d2d7c40-9f10-4a94-9c44-4cc3fbb81f67',
  })
  @IsOptional()
  @IsUUID()
  providerAgencyId?: string;

  @ApiPropertyOptional({ example: '2026-09-12T10:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  invitedAt?: string;

  @ApiPropertyOptional({ example: 23.7465, minimum: -90, maximum: 90 })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  currentLat?: number;

  @ApiPropertyOptional({ example: 90.376, minimum: -180, maximum: 180 })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  currentLong?: number;
}

export class UpdateTechnicianProfileDto {
  @ApiPropertyOptional({
    format: 'uuid',
    example: '4d2d7c40-9f10-4a94-9c44-4cc3fbb81f67',
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  providerAgencyId?: string;

  @ApiPropertyOptional({ example: '2026-09-12T10:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  invitedAt?: string;

  @ApiPropertyOptional({ example: '2026-09-12T10:15:00.000Z' })
  @IsOptional()
  @IsDateString()
  lastLoginAt?: string;

  @ApiPropertyOptional({ example: 23.7465, minimum: -90, maximum: 90 })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  currentLat?: number;

  @ApiPropertyOptional({ example: 90.376, minimum: -180, maximum: 180 })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  currentLong?: number;
}
