import { ApiPropertyOptional } from '@nestjs/swagger';
import { KycStatus } from '@prisma/client';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateProviderKycDto {
  @ApiPropertyOptional({ example: '1234567890123', maxLength: 30 })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  nidNumber?: string;

  @ApiPropertyOptional({ example: 'TRD-2026-0001', maxLength: 40 })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  tradeLicenseNo?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/uploads/nid-front.jpg',
  })
  @IsOptional()
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  @MaxLength(255)
  nidFrontUrl?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/uploads/nid-back.jpg',
  })
  @IsOptional()
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  @MaxLength(255)
  nidBackUrl?: string;
}

export class UpdateProviderKycDto extends CreateProviderKycDto {}

export class UpdateProviderKycStatusDto {
  @ApiPropertyOptional({ enum: KycStatus, example: KycStatus.APPROVED })
  @IsEnum(KycStatus)
  status!: KycStatus;
}
