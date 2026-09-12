import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateCustomerRetentionDto {
  @ApiProperty({
    format: 'uuid',
    example: '6e7f4f75-d1dc-49eb-90ad-854d8fe363d0',
  })
  @IsUUID()
  providerId!: string;

  @ApiProperty({
    format: 'uuid',
    example: '87af2a7b-8d14-4f6e-a2d9-469d5f51855e',
  })
  @IsUUID()
  customerId!: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isChatActive?: boolean;

  @ApiPropertyOptional({
    example: 'Customer requested to stop chat',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  removedReason?: string;
}

export class UpdateCustomerRetentionDto {
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isChatActive?: boolean;

  @ApiPropertyOptional({
    example: 'Customer requested to stop chat',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  removedReason?: string;
}
