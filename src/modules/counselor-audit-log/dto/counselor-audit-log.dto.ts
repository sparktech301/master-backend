import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CounselorActionType } from '@prisma/client';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateCounselorAuditLogDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  counselorId!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  sessionId!: string;

  @ApiProperty({
    enum: CounselorActionType,
    example: CounselorActionType.ASSIGNED,
  })
  @IsEnum(CounselorActionType)
  actionType!: CounselorActionType;

  @ApiPropertyOptional({
    example: 'Counselor assigned to session',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  remarks?: string;
}

export class UpdateCounselorAuditLogDto {
  @ApiPropertyOptional({ enum: CounselorActionType })
  @IsOptional()
  @IsEnum(CounselorActionType)
  actionType?: CounselorActionType;

  @ApiPropertyOptional({ example: 'Updated remarks', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  remarks?: string;
}
