import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatAuditLogService } from './chat-audit-log.service';
import { CreateChatAuditLogDto } from './dto/chat-audit-log.dto';

@ApiTags('Chat Audit Log')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('chat-audit-log')
export class ChatAuditLogController {
  constructor(private readonly chatAuditLogService: ChatAuditLogService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create chat audit log' })
  create(@Body() data: CreateChatAuditLogDto) {
    return this.chatAuditLogService.create(data);
  }

  @Get()
  findAll() {
    return this.chatAuditLogService.findAll();
  }

  @Get('session/:sessionId')
  findBySession(@Param('sessionId', new ParseUUIDPipe()) sessionId: string) {
    return this.chatAuditLogService.findBySession(sessionId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatAuditLogService.findOne(BigInt(id));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatAuditLogService.remove(BigInt(id));
  }
}
