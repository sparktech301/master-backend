import { MessageType } from '@prisma/client';
import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class SendMessageDto {
  @IsUUID()
  @IsNotEmpty()
  conversationId!: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  text?: string;

  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
  })
  @IsOptional()
  fileUrl?: string;

  @IsIn([
    MessageType.TEXT,
    MessageType.IMAGE,
    MessageType.VIDEO,
    MessageType.AUDIO,
    MessageType.FILE,
    MessageType.OFFER,
  ])
  @IsOptional()
  type?: MessageType;
}
