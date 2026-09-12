import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChatSlotStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export class CreateActiveChatSlotDto {
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

  @ApiProperty({
    format: 'uuid',
    example: '4d2d7c40-9f10-4a94-9c44-4cc3fbb81f67',
  })
  @IsUUID()
  serviceId!: string;

  @ApiPropertyOptional({
    enum: ChatSlotStatus,
    example: ChatSlotStatus.ACTIVE,
    default: ChatSlotStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(ChatSlotStatus)
  status?: ChatSlotStatus;
}

export class UpdateActiveChatSlotDto {
  @ApiPropertyOptional({
    enum: ChatSlotStatus,
    example: ChatSlotStatus.CLOSED,
  })
  @IsOptional()
  @IsEnum(ChatSlotStatus)
  status?: ChatSlotStatus;
}
