import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuditFlowType, MessageType } from '@prisma/client';
import { IsEnum, IsObject, IsOptional, IsUUID } from 'class-validator';

export class CreateChatAuditLogDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  sessionId!: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  senderId?: string;

  @ApiProperty({ enum: AuditFlowType, example: AuditFlowType.CHAT })
  @IsEnum(AuditFlowType)
  flowType!: AuditFlowType;

  @ApiPropertyOptional({ enum: MessageType, example: MessageType.TEXT })
  @IsOptional()
  @IsEnum(MessageType)
  messageType?: MessageType;

  @ApiPropertyOptional({ example: { text: 'Hello' } })
  @IsOptional()
  @IsObject()
  messagePayload?: Record<string, unknown>;
}
